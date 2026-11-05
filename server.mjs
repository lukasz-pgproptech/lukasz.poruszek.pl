import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 4321;
const CAL_API_KEY = 'cal_live_c60e9d492b4c6ca4e69f6901d24b94b5';
const WORKSHOP_EVENT_TYPE_ID = 7790358;
const WAITLIST_EVENT_TYPE_ID = 7791068;

// Upewnij się, że katalog na dane istnieje
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function saveJsonData(filename, entry) {
  const filePath = path.join(DATA_DIR, filename);
  let list = [];
  try {
    if (fs.existsSync(filePath)) {
      list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {
    list = [];
  }
  list.push({ ...entry, createdAt: new Date().toISOString() });
  fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf8');
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.gltf': 'model/gltf+json; charset=utf-8',
  '.bin': 'application/octet-stream',
  '.ktx': 'application/octet-stream',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webmanifest': 'application/manifest+json'
};

const server = http.createServer((req, res) => {
  // CORS & Cache headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let reqPath = decodeURIComponent(req.url.split('?')[0]);

  // -------------------------------------------------------------
  // API: REZERWACJA WARSZTATÓW AI -> ZAPIS + POWIADOMIENIE CAL.COM
  // -------------------------------------------------------------
  if (req.method === 'POST' && reqPath === '/api/reserve-workshop') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { name, email, phone } = payload;

        if (!email || !name) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Brak imienia lub adresu e-mail.' }));
          return;
        }

        // 1. Zapis lokalny do bazy
        saveJsonData('reservations.json', {
          event: 'Warsztaty AI',
          group: 'Grupa grudniowa (start 1.12.2026, 19:00)',
          name,
          email,
          phone: phone || ''
        });

        // 2. Utworzenie rezerwacji w Cal.com -> automatyczny e-mail na lukasz.poruszek@pgproptech.com
        let calBookingResult = null;
        try {
          const calRes = await fetch('https://api.cal.com/v2/bookings', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${CAL_API_KEY}`,
              'Content-Type': 'application/json',
              'cal-api-version': '2024-08-13'
            },
            body: JSON.stringify({
              eventTypeId: WORKSHOP_EVENT_TYPE_ID,
              start: '2026-12-01T18:00:00.000Z',
              attendee: {
                name: name,
                email: email,
                timeZone: 'Europe/Warsaw',
                phoneNumber: phone || undefined
              },
              metadata: {
                source: 'lukasz.poruszek.pl',
                note: 'Rezerwacja Warsztatów AI (Grupa grudniowa)'
              }
            })
          });

          if (calRes.ok) {
            calBookingResult = await calRes.json();
            console.log('Cal.com workshop booking created successfully -> notification sent to lukasz.poruszek@pgproptech.com');
          } else {
            const errTxt = await calRes.text();
            console.warn('Cal.com booking API warning:', calRes.status, errTxt);
          }
        } catch (calErr) {
          console.error('Cal.com API error:', calErr);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          message: 'Rezerwacja przyjęta.',
          calSynced: Boolean(calBookingResult)
        }));
      } catch (err) {
        console.error('Error parsing reservation body:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Błąd serwera.' }));
      }
    });
    return;
  }

  // -------------------------------------------------------------
  // API: LISTA REZERWOWA (MENTORING) -> ZAPIS + POWIADOMIENIE CAL.COM Z NOTATKĄ
  // -------------------------------------------------------------
  if (req.method === 'POST' && reqPath === '/api/waitlist') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { email, note, type, month } = payload;

        if (!email) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Brak adresu e-mail.' }));
          return;
        }

        // 1. Zapis lokalny do pliku JSON
        saveJsonData('waitlist.json', {
          email,
          note: note || '',
          type: type || 'Mentoring biznesowy',
          month: month || 'Listopad 2026'
        });

        // 2. Utworzenie wpisu w Cal.com -> wysyła powiadomienie e-mail z notatką na lukasz.poruszek@pgproptech.com
        let calWaitlistResult = null;
        try {
          const slotDate = new Date();
          slotDate.setUTCDate(slotDate.getUTCDate() + 1);
          slotDate.setUTCHours(12, 0, 0, 0);

          const calRes = await fetch('https://api.cal.com/v2/bookings', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${CAL_API_KEY}`,
              'Content-Type': 'application/json',
              'cal-api-version': '2024-08-13'
            },
            body: JSON.stringify({
              eventTypeId: WAITLIST_EVENT_TYPE_ID,
              start: slotDate.toISOString(),
              attendee: {
                name: `Lista Rezerwowa (${type || 'Mentoring'})`,
                email: email,
                timeZone: 'Europe/Warsaw'
              },
              metadata: {
                notatka: note || 'Brak notatki',
                typ_mentoringu: type || 'Mentoring',
                miesiac: month || 'Bieżący',
                source: 'Lista rezerwowa lukasz.poruszek.pl'
              }
            })
          });

          if (calRes.ok) {
            calWaitlistResult = await calRes.json();
            console.log('Cal.com waitlist entry created successfully -> email notification sent to lukasz.poruszek@pgproptech.com');
          } else {
            const errTxt = await calRes.text();
            console.warn('Cal.com waitlist API warning:', calRes.status, errTxt);
          }
        } catch (calErr) {
          console.error('Cal.com waitlist API error:', calErr);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          message: 'Zapisano na listę rezerwową.',
          calSynced: Boolean(calWaitlistResult)
        }));
      } catch (err) {
        console.error('Error parsing waitlist body:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Błąd serwera.' }));
      }
    });
    return;
  }

  // -------------------------------------------------------------
  // STATYCZNE SERWOWANIE PLIKÓW
  // -------------------------------------------------------------
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(__dirname, reqPath);

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 Not Found: ${reqPath}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Corn Revolution local server running at http://localhost:${PORT}/`);
});
