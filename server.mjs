import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Wczytaj zmienne środowiskowe z .env jeśli plik istnieje
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  try {
    process.loadEnvFile(envPath);
    console.log('[Server] Załadowano konfigurację z pliku .env');
  } catch (e) {
    console.warn('[Server] Błąd ładowania .env:', e.message);
  }
}

const PORT = process.env.PORT || 4321;
const CAL_API_KEY = process.env.CAL_API_KEY || 'cal_live_c60e9d492b4c6ca4e69f6901d24b94b5';
const WORKSHOP_EVENT_TYPE_ID = 7790358;
const WAITLIST_EVENT_TYPE_ID = 7791068;

// Konfiguracja Paynow (mBank)
const PAYNOW_API_KEY = process.env.PAYNOW_API_KEY || '';
const PAYNOW_SIGNATURE_KEY = process.env.PAYNOW_SIGNATURE_KEY || '';
const PAYNOW_ENV = process.env.PAYNOW_ENV || 'production'; // 'sandbox' lub 'production'
const PAYNOW_API_URL = PAYNOW_ENV === 'sandbox'
  ? 'https://api.sandbox.paynow.pl'
  : 'https://api.paynow.pl';

// Kody rabatowe
const COUPONS = {
  'CHORWACJA': 50,  // -50%
  'RESICRAFT': 50,  // -50%
  '432834145': 100  // -100% (Bezpłatnie)
};

const BASE_WORKSHOP_PRICE = 1200; // PLN
const BASE_MENTORING_PRICE = 400; // PLN

// Sygnatura HMAC SHA-256 dla API v3 Paynow
function calculatePaynowSignature(apiKey, signatureKey, idempotencyKey, bodyObj) {
  const signaturePayload = {
    headers: {
      'Api-Key': apiKey,
      'Idempotency-Key': idempotencyKey,
    },
    parameters: {},
    body: bodyObj
  };
  return crypto
    .createHmac('sha256', signatureKey)
    .update(JSON.stringify(signaturePayload))
    .digest('base64');
}

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
  // API: REZERWACJA WARSZTATÓW AI + PŁATNOŚĆ PAYNOW + KODY RABATOWE
  // -------------------------------------------------------------
  if (req.method === 'POST' && reqPath === '/api/reserve-workshop') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { name, email, phone, group, groupId, coupon } = payload;

        if (!email || !name) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Brak imienia lub adresu e-mail.' }));
          return;
        }

        const selectedGroup = group || 'Grupa grudniowa (start 1.12.2026, 19:00)';
        const workshopDate = (groupId === 'january') ? '2027-01-05T18:00:00.000Z' : '2026-12-01T18:00:00.000Z';

        // Obliczenie ceny z uwzględnieniem kodu rabatowego
        let discountPercent = 0;
        const normalizedCoupon = coupon ? String(coupon).trim().toUpperCase() : null;
        if (normalizedCoupon && COUPONS[normalizedCoupon] !== undefined) {
          discountPercent = COUPONS[normalizedCoupon];
        }

        const finalPricePln = Math.max(0, Math.round(BASE_WORKSHOP_PRICE * (1 - discountPercent / 100)));
        const finalPriceGrosze = finalPricePln * 100;
        const externalId = `ws-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

        // SCENARIUSZ A: Kwota 0 PLN (np. kod 432834145) -> Natychmiastowa rezerwacja bez bramki płatności
        if (finalPricePln === 0) {
          saveJsonData('reservations.json', {
            event: 'Warsztaty AI',
            group: selectedGroup,
            name,
            email,
            phone: phone || '',
            coupon: normalizedCoupon,
            amountPln: 0,
            paymentStatus: 'free_100_percent_discount',
            externalId
          });

          // Cal.com notification
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
                start: workshopDate,
                attendee: {
                  name: name,
                  email: email,
                  timeZone: 'Europe/Warsaw',
                  phoneNumber: phone || undefined
                },
                metadata: {
                  source: 'lukasz.poruszek.pl',
                  note: `Rezerwacja Warsztatów AI (${selectedGroup}) - Rabat 100% (Kod: ${normalizedCoupon})`
                }
              })
            });
            if (calRes.ok) calBookingResult = await calRes.json();
          } catch (calErr) {
            console.error('Cal.com API error:', calErr);
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            isZeroPayment: true,
            message: 'Rezerwacja przyjęta bezpłatnie (kod 100%).',
            calSynced: Boolean(calBookingResult)
          }));
          return;
        }

        // SCENARIUSZ B: Płatność online przez Paynow
        if (PAYNOW_API_KEY && PAYNOW_SIGNATURE_KEY) {
          try {
            const origin = req.headers.origin || `http://${req.headers.host || 'localhost:4321'}`;
            const idempotencyKey = crypto.randomUUID ? crypto.randomUUID() : `idem-${Date.now()}-${Math.random().toString(36).slice(2)}`;
            const paymentPayload = {
              amount: finalPriceGrosze,
              currency: 'PLN',
              externalId: externalId,
              description: `Warsztaty AI - ${selectedGroup}`,
              buyer: {
                email: email,
                firstName: name.split(' ')[0] || name,
                lastName: name.split(' ').slice(1).join(' ') || 'Uczestnik',
                phone: phone || undefined
              },
              continueUrl: `${origin}/?payment=success&order=${externalId}`
            };

            const signature = calculatePaynowSignature(PAYNOW_API_KEY, PAYNOW_SIGNATURE_KEY, idempotencyKey, paymentPayload);

            const paynowRes = await fetch(`${PAYNOW_API_URL}/v3/payments`, {
              method: 'POST',
              headers: {
                'Api-Key': PAYNOW_API_KEY,
                'Signature': signature,
                'Idempotency-Key': idempotencyKey,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(paymentPayload)
            });

            const paynowData = await paynowRes.json();

            if (paynowRes.ok && paynowData.redirectUrl) {
              saveJsonData('reservations.json', {
                event: 'Warsztaty AI',
                group: selectedGroup,
                name,
                email,
                phone: phone || '',
                coupon: normalizedCoupon || null,
                amountPln: finalPricePln,
                externalId,
                paymentId: paynowData.paymentId,
                paymentStatus: 'pending_paynow'
              });

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                success: true,
                redirectUrl: paynowData.redirectUrl,
                paymentId: paynowData.paymentId,
                amountPln: finalPricePln
              }));
              return;
            } else {
              console.warn('[Paynow] Błąd tworzenia płatności:', paynowRes.status, paynowData);
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                error: 'Błąd bramki Paynow: ' + (paynowData.message || 'Spróbuj ponownie później.')
              }));
              return;
            }
          } catch (payErr) {
            console.error('[Paynow] Wyjątek połączenia:', payErr);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Błąd połączenia z bramką płatności Paynow.' }));
            return;
          }
        }

        // SCENARIUSZ C: Brak skonfigurowanych kluczy PAYNOW w .env (Tryb deweloperski / oczekiwanie na klucze)
        console.log(`[Paynow Mock/Dev] Rezerwacja przyjęta. Skonfiguruj PAYNOW_API_KEY i PAYNOW_SIGNATURE_KEY w pliku .env, aby aktywować bramkę mBank Paynow.`);
        saveJsonData('reservations.json', {
          event: 'Warsztaty AI',
          group: selectedGroup,
          name,
          email,
          phone: phone || '',
          coupon: normalizedCoupon || null,
          amountPln: finalPricePln,
          externalId,
          paymentStatus: 'pending_paynow_config'
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          requiresConfig: true,
          amountPln: finalPricePln,
          message: 'Zgłoszenie zarejestrowane (Paynow czeka na klucze w .env).'
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
  if (reqPath === '/widget' || reqPath === '/widget/' || reqPath === '/sandbox') {
    reqPath = '/widget-dev.html';
  } else if (reqPath === '/' || reqPath === '') {
    reqPath = fs.existsSync(path.join(__dirname, 'index.3d.html')) ? '/index.3d.html' : '/index.html';
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
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Corn Revolution local server running at http://localhost:${PORT}/`);
});
