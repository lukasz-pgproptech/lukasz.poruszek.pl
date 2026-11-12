import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createAndRegisterInvoice, getInvoiceById, generateInvoiceHtml, SELLER_DATA } from './ksef-client.mjs';
import { sendReservationEmail, sendWaitlistNotificationEmail } from './email-service.mjs';
import { getPublicDecemberSlots, bookMentoringSlot, DECEMBER_HOLIDAYS } from './mentoring-slots.mjs';

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

/**
 * Generuje string przelewu QR zgodny w 100% ze standardem Rekomendacji ZBP 2D
 * dla polskich aplikacji bankowości mobilnej (mBank, PKO IKO, Santander, ING, Millennium, Alior itd.)
 *
 * Format pól oddzielonych znakiem '|':
 * 1. NIP odbiorcy (10 cyfr)
 * 2. Kod kraju ('PL')
 * 3. Numer rachunku NRB (26 cyfr bez spacji)
 * 4. Kwota w groszach (liczba całkowita, min. 6 cyfr z wiodącymi zerami, np. '020000' dla 200 PLN)
 * 5. Nazwa odbiorcy (max 20 znaków!)
 * 6. Tytuł przelewu (max 32 znaki!)
 * 7. Pole zarezerwowane 1 (puste '')
 * 8. Pole zarezerwowane 2 (puste '')
 * 9. Pole zarezerwowane 3 (puste '')
 */
export function generateZbpBankQrPayload({ nip = '7963033913', accountRaw, amountPln, recipientShort = 'PG Proptech Sp z oo', title }) {
  const cleanAccount = String(accountRaw || '').replace(/\D/g, '');
  const cleanNip = String(nip || '').replace(/\D/g, '');
  const amountGrosze = Math.round(Number(amountPln || 0) * 100);
  const formattedAmount = String(amountGrosze).padStart(6, '0');

  // Rekomendacja ZBP 2D: Nazwa odbiorcy max 20 znaków, tytuł max 32 znaki
  const cleanRecipient = String(recipientShort || 'PG Proptech Sp z oo')
    .replace(/\|/g, '')
    .trim()
    .slice(0, 20);

  const cleanTitle = String(title || 'Przelew')
    .replace(/\|/g, '')
    .trim()
    .slice(0, 32);

  const fields = [
    cleanNip,          // 1: NIP
    'PL',              // 2: Kod kraju
    cleanAccount,      // 3: 26-cyfrowy rachunek NRB
    formattedAmount,   // 4: Kwota w groszach (np. 020000 dla 200 PLN)
    cleanRecipient,    // 5: Nazwa odbiorcy (max 20 znaków)
    cleanTitle,        // 6: Tytuł przelewu (max 32 znaki)
    '',                // 7: Reserved 1
    '',                // 8: Reserved 2
    ''                 // 9: Reserved 3
  ];

  return fields.join('|');
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
  // API: WALIDACJA KODU RABATOWEGO (ZABEZPIECZONA PO STRONIE SERWERA)
  // -------------------------------------------------------------
  if (req.method === 'POST' && reqPath === '/api/validate-coupon') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const rawCode = payload.code || payload.coupon || '';
        const code = String(rawCode).trim().toUpperCase();

        if (!code) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ valid: false, message: 'Brak kodu.' }));
          return;
        }

        if (COUPONS[code] !== undefined) {
          const discountPercent = COUPONS[code];
          const labels = {
            'CHORWACJA': '-50% (Rabat partnerski)',
            'RESICRAFT': '-50% (Rabat partnerski)',
            '432834145': '-100% (Bezpłatny dostęp)'
          };
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            valid: true,
            code,
            discountPercent,
            label: labels[code] || `-${discountPercent}%`
          }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ valid: false, error: 'Nieprawidłowy lub wygasły kod rabatowy.' }));
        }
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Nieprawidłowe zapytanie.' }));
      }
    });
    return;
  }

  // -------------------------------------------------------------
  // API: WYSZUKIWANIE DANYCH FIRMY PO NIP (Biała Lista VAT MF)
  // -------------------------------------------------------------
  if (req.method === 'GET' && (reqPath === '/api/nip-lookup' || reqPath.startsWith('/api/nip/'))) {
    const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const rawNip = reqPath === '/api/nip-lookup'
      ? (urlObj.searchParams.get('nip') || '')
      : reqPath.replace('/api/nip/', '');
    const cleanNip = String(rawNip).replace(/\D/g, '');

    if (cleanNip.length !== 10) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'NIP musi zawierać dokładnie 10 cyfr.' }));
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const mfUrl = `https://wl-api.mf.gov.pl/api/search/nip/${cleanNip}?date=${today}`;

    (async () => {
      try {
        const mfRes = await fetch(mfUrl);
        const mfData = await mfRes.json();

        if (mfRes.ok && mfData.result && mfData.result.subject) {
          const subj = mfData.result.subject;
          const fullAddress = subj.residenceAddress || subj.workingAddress || '';
          
          let street = fullAddress;
          let postalCode = '';
          let city = '';
          const postalMatch = fullAddress.match(/(\d{2}-\d{3})\s+([^,]+)/);
          if (postalMatch) {
            postalCode = postalMatch[1];
            city = postalMatch[2].trim();
            street = fullAddress.replace(/,?\s*\d{2}-\d{3}\s+[^,]+/, '').trim();
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            name: subj.name,
            nip: cleanNip,
            regon: subj.regon || '',
            krs: subj.krs || '',
            statusVat: subj.statusVat,
            fullAddress,
            street,
            postalCode,
            city
          }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: (mfData.message || 'Nie znaleziono firmy o podanym numerze NIP w rejestrze MF.')
          }));
        }
      } catch (err) {
        console.error('Błąd NIP lookup:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Błąd połączenia z rejestrem MF.' }));
      }
    })();
    return;
  }

  // -------------------------------------------------------------
  // API: POBIERANIE WIZUALIZACJI FAKTURY KSEF (HTML / DRUK)
  // -------------------------------------------------------------
  if ((req.method === 'GET' || req.method === 'HEAD') && reqPath.startsWith('/api/invoices/')) {
    const invId = reqPath.replace('/api/invoices/', '');
    const invoice = getInvoiceById(invId);
    if (!invoice) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Faktura nie została znaleziona.');
      return;
    }
    const html = generateInvoiceHtml(invoice);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    res.end(html);
    return;
  }

  // -------------------------------------------------------------
  // API: KONFIGURACJA METODY PŁATNOŚCI (PAYNOW VS PRZELEW BANKOWY)
  // -------------------------------------------------------------
  if (req.method === 'GET' && reqPath === '/api/payment-config') {
    const isPaynowActive = Boolean(PAYNOW_API_KEY && PAYNOW_SIGNATURE_KEY && (process.env.PAYMENT_MODE !== 'bank_transfer'));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      mode: isPaynowActive ? 'paynow' : 'bank_transfer',
      accountNumber: '46 1140 2004 0000 3902 8547 5429',
      recipient: 'POLSKA GRUPA PROPTECH SP. Z O.O.'
    }));
    return;
  }

  // -------------------------------------------------------------
  // API: REZERWACJA WARSZTATÓW AI + PŁATNOŚĆ PAYNOW + KODY + KSEF
  // -------------------------------------------------------------
  if (req.method === 'POST' && reqPath === '/api/reserve-workshop') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const {
          name, email, phone, group, groupId, coupon,
          buyerType = 'individual',
          invoiceNip,
          invoiceCompanyName,
          invoiceStreet,
          invoicePostalCode,
          invoiceCity
        } = payload;

        if (!email || !name) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Brak imienia lub adresu e-mail.' }));
          return;
        }

        const selectedGroup = group || 'Grupa grudniowa (start 1.12.2026, 19:00)';
        const workshopDate = (groupId === 'january') ? '2027-01-05T18:00:00.000Z' : '2026-12-01T18:00:00.000Z';

        // Obliczenie ceny z uwzględnieniem kodu rabatowego (walidacja serwera)
        let discountPercent = 0;
        const normalizedCoupon = coupon ? String(coupon).trim().toUpperCase() : null;
        if (normalizedCoupon && COUPONS[normalizedCoupon] !== undefined) {
          discountPercent = COUPONS[normalizedCoupon];
        }

        const finalPricePln = Math.max(0, Math.round(BASE_WORKSHOP_PRICE * (1 - discountPercent / 100)));
        const finalPriceGrosze = finalPricePln * 100;
        const externalId = `ws-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

        const isCompany = buyerType === 'company';
        const buyer = {
          type: buyerType,
          name: isCompany ? (invoiceCompanyName || name) : name,
          email,
          phone,
          nip: isCompany ? (invoiceNip || '').replace(/\D/g, '') : null,
          street: invoiceStreet || '',
          postalCode: invoicePostalCode || '',
          city: invoiceCity || ''
        };

        // SCENARIUSZ A: Kwota 0 PLN (kod 100% rabatu) -> Natychmiastowa e-Faktura KSeF i potwierdzenie
        if (finalPricePln === 0) {
          const invoice = await createAndRegisterInvoice({
            group: selectedGroup,
            name,
            email,
            phone,
            amountPln: 0,
            coupon: normalizedCoupon,
            buyer,
            externalId
          });

          saveJsonData('reservations.json', {
            event: 'Warsztaty AI',
            group: selectedGroup,
            name,
            email,
            phone: phone || '',
            coupon: normalizedCoupon,
            amountPln: 0,
            paymentStatus: 'free_100_percent_discount',
            externalId,
            buyer,
            invoiceNumber: invoice.invoiceNumber,
            ksefNumber: invoice.ksefNumber,
            invoiceId: invoice.id
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
                  note: `Rezerwacja Warsztatów AI (${selectedGroup}) - Rabat 100% (Kod: ${normalizedCoupon}) | Faktura KSeF: ${invoice.invoiceNumber}`
                }
              })
            });
            if (calRes.ok) calBookingResult = await calRes.json();
          } catch (calErr) {
            console.error('Cal.com API error:', calErr);
          }

          // Automatyczna wysyłka e-mail z potwierdzeniem (Resend)
          try {
            const invoiceHtml = generateInvoiceHtml(invoice);
            sendReservationEmail({
              to: email,
              name,
              group: selectedGroup,
              amountPln: 0,
              invoiceNumber: invoice.invoiceNumber,
              invoiceId: invoice.id,
              invoiceHtml,
              isZeroPayment: true,
              buyer
            }).catch(mailErr => console.error('[Server] Błąd asynchronicznej wysyłki e-mail (free):', mailErr));
          } catch (e) {
            console.warn('[Server] Błąd przygotowania maila:', e.message);
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            isZeroPayment: true,
            message: 'Rezerwacja przyjęta bezpłatnie (kod 100%).',
            invoiceNumber: invoice.invoiceNumber,
            ksefNumber: invoice.ksefNumber,
            invoiceUrl: `/api/invoices/${invoice.id}`,
            calSynced: Boolean(calBookingResult)
          }));
          return;
        }

        // SCENARIUSZ B: Płatność online przez Paynow (jeśli skonfigurowano klucze i nie wymuszono bank_transfer)
        const isPaynowActive = Boolean(PAYNOW_API_KEY && PAYNOW_SIGNATURE_KEY && (process.env.PAYMENT_MODE !== 'bank_transfer'));
        if (isPaynowActive) {
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
                paymentMode: 'paynow',
                paymentStatus: 'pending_paynow',
                buyer
              });

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                success: true,
                paymentMode: 'paynow',
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

        // SCENARIUSZ C: Płatność bezpośrednim przelewem bankowym + kod QR (Propozycja 1 na czas oczekiwania na akceptację Paynow)
        const invoice = await createAndRegisterInvoice({
          group: selectedGroup,
          name,
          email,
          phone,
          amountPln: finalPricePln,
          coupon: normalizedCoupon,
          buyer,
          externalId,
          isProforma: true
        });

        const rawAccount = '46114020040000390285475429';
        const formattedAccount = '46 1140 2004 0000 3902 8547 5429';
        const transferTitle = `Warsztaty AI ${invoice.invoiceNumber}`;
        const recipientName = 'POLSKA GRUPA PROPTECH SP. Z O.O.';
        const recipientShort = 'PG Proptech Sp z oo';

        // 100% oficjalny standard Rekomendacji ZBP 2D do przelewów bankowych (mBank, PKO, ING, Santander, Millennium)
        const qrPayload = generateZbpBankQrPayload({
          nip: '7963033913',
          accountRaw: rawAccount,
          amountPln: finalPricePln,
          recipientShort,
          title: transferTitle
        });

        console.log(`[Bank Transfer] Rezerwacja przyjęta. Wygenerowano Proformę: ${invoice.invoiceNumber}. Kwota: ${finalPricePln} PLN`);
        saveJsonData('reservations.json', {
          event: 'Warsztaty AI',
          group: selectedGroup,
          name,
          email,
          phone: phone || '',
          coupon: normalizedCoupon || null,
          amountPln: finalPricePln,
          externalId,
          paymentMode: 'bank_transfer',
          paymentStatus: 'pending_bank_transfer',
          buyer,
          invoiceNumber: invoice.invoiceNumber,
          isProforma: true,
          invoiceId: invoice.id
        });

        // Automatyczna wysyłka e-mail z fakturą proforma w PDF (Resend)
        try {
          const invoiceHtml = generateInvoiceHtml(invoice);
          sendReservationEmail({
            to: email,
            name,
            group: selectedGroup,
            amountPln: finalPricePln,
            invoiceNumber: invoice.invoiceNumber,
            invoiceId: invoice.id,
            invoiceHtml,
            transfer: {
              recipient: recipientName,
              accountFormatted: formattedAccount,
              title: transferTitle,
              amountFormatted: `${finalPricePln.toLocaleString('pl-PL')} PLN`
            },
            isZeroPayment: false,
            buyer
          }).catch(mailErr => console.error('[Server] Błąd asynchronicznej wysyłki e-mail (proforma):', mailErr));
        } catch (mailPrepErr) {
          console.warn('[Server] Błąd przygotowania e-maila z proformą:', mailPrepErr.message);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          paymentMode: 'bank_transfer',
          amountPln: finalPricePln,
          invoiceNumber: invoice.invoiceNumber,
          invoiceUrl: `/api/invoices/${invoice.id}`,
          isProforma: true,
          invoice: {
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            downloadUrl: `/api/invoices/${invoice.id}`
          },
          transfer: {
            recipient: recipientName,
            recipientShort: recipientShort,
            account: formattedAccount,
            accountFormatted: formattedAccount,
            accountRaw: rawAccount,
            rawAccount: rawAccount,
            title: transferTitle,
            amount: finalPricePln,
            amountPln: finalPricePln,
            amountFormatted: `${finalPricePln.toLocaleString('pl-PL')} PLN`,
            nip: '7963033913',
            qrPayload: qrPayload
          },
          message: 'Rezerwacja wstępna przyjęta. Miejsce zablokowane na 24h.'
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
  // API: GRAFIK MENTORINGU (GRUDZIEŃ 2026)
  // -------------------------------------------------------------
  if (req.method === 'GET' && reqPath === '/api/mentoring-slots') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      month: '2026-12',
      holidays: DECEMBER_HOLIDAYS,
      slots: getPublicDecemberSlots()
    }));
    return;
  }

  // -------------------------------------------------------------
  // API: REZERWACJA MENTORINGU 1:1 + PROFORMA + BUFFER REPLENISHMENT
  // -------------------------------------------------------------
  if (req.method === 'POST' && reqPath === '/api/reserve-mentoring') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const {
          name, email, phone, slotId, mentoringType = 'Mentoring biznesowy',
          coupon,
          buyerType = 'individual',
          invoiceNip,
          invoiceCompanyName,
          invoiceStreet,
          invoicePostalCode,
          invoiceCity
        } = payload;

        if (!email || !name || !slotId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Brak wymaganych danych rezerwacji (imię, e-mail lub termin).' }));
          return;
        }

        const externalId = `ment-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

        // 1. Rezerwacja w silniku mentoringu (sprawdza dostępność i uzupełnia pulę fake_booked)
        const bookResult = bookMentoringSlot({
          slotId,
          name,
          email,
          phone,
          reservationId: externalId
        });

        if (!bookResult.success) {
          res.writeHead(409, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: bookResult.error }));
          return;
        }

        // 2. Kalkulacja kwoty z kodem rabatowym (400 PLN bazowo)
        let discountPercent = 0;
        const normalizedCoupon = coupon ? String(coupon).trim().toUpperCase() : null;
        if (normalizedCoupon && COUPONS[normalizedCoupon] !== undefined) {
          discountPercent = COUPONS[normalizedCoupon];
        }

        const finalPricePln = Math.max(0, Math.round(BASE_MENTORING_PRICE * (1 - discountPercent / 100)));
        const isCompany = buyerType === 'company';
        const buyer = {
          type: buyerType,
          name: isCompany ? (invoiceCompanyName || name) : name,
          email,
          phone,
          nip: isCompany ? (invoiceNip || '').replace(/\D/g, '') : null,
          street: invoiceStreet || '',
          postalCode: invoicePostalCode || '',
          city: invoiceCity || ''
        };

        const eventDescription = `${mentoringType} (${bookResult.slot.date}, godz. ${bookResult.slot.time})`;

        // 3. Generowanie Proformy KSeF
        const invoice = await createAndRegisterInvoice({
          group: eventDescription,
          name,
          email,
          phone,
          amountPln: finalPricePln,
          coupon: normalizedCoupon,
          buyer,
          externalId,
          isProforma: true
        });

        const rawAccount = '46114020040000390285475429';
        const formattedAccount = '46 1140 2004 0000 3902 8547 5429';
        const transferTitle = `Mentoring ${invoice.invoiceNumber}`;
        const recipientName = 'POLSKA GRUPA PROPTECH SP. Z O.O.';
        const recipientShort = 'PG Proptech Sp z oo';

        // 100% oficjalny standard Rekomendacji ZBP 2D do przelewów bankowych (mBank, PKO, ING, Santander, Millennium)
        const qrPayload = generateZbpBankQrPayload({
          nip: '7963033913',
          accountRaw: rawAccount,
          amountPln: finalPricePln,
          recipientShort,
          title: transferTitle
        });

        // 4. Zapis w reservations.json
        saveJsonData('reservations.json', {
          event: mentoringType,
          slotId,
          date: bookResult.slot.date,
          time: bookResult.slot.time,
          group: eventDescription,
          name,
          email,
          phone: phone || '',
          coupon: normalizedCoupon || null,
          amountPln: finalPricePln,
          externalId,
          paymentMode: 'bank_transfer',
          paymentStatus: 'pending_bank_transfer',
          buyer,
          invoiceNumber: invoice.invoiceNumber,
          isProforma: true,
          invoiceId: invoice.id
        });

        // 5. Automatyczna wysyłka e-mail z fakturą proforma PDF przez Resend (do klienta + BCC do Łukasza)
        try {
          const invoiceHtml = generateInvoiceHtml(invoice);
          sendReservationEmail({
            to: email,
            name,
            group: eventDescription,
            amountPln: finalPricePln,
            invoiceNumber: invoice.invoiceNumber,
            invoiceId: invoice.id,
            invoiceHtml,
            transfer: {
              recipient: recipientName,
              accountFormatted: formattedAccount,
              title: transferTitle,
              amountFormatted: `${finalPricePln.toLocaleString('pl-PL')} PLN`
            },
            isZeroPayment: finalPricePln === 0,
            buyer
          }).catch(mailErr => console.error('[Server] Błąd asynchronicznej wysyłki e-mail mentoringu:', mailErr));
        } catch (mailPrepErr) {
          console.warn('[Server] Błąd przygotowania e-maila mentoringu:', mailPrepErr.message);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          paymentMode: 'bank_transfer',
          amountPln: finalPricePln,
          invoiceNumber: invoice.invoiceNumber,
          invoiceUrl: `/api/invoices/${invoice.id}`,
          isProforma: true,
          invoice: {
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            downloadUrl: `/api/invoices/${invoice.id}`
          },
          slot: bookResult.slot,
          transfer: {
            recipient: recipientName,
            recipientShort: recipientShort,
            account: formattedAccount,
            accountFormatted: formattedAccount,
            accountRaw: rawAccount,
            rawAccount: rawAccount,
            title: transferTitle,
            amount: finalPricePln,
            amountPln: finalPricePln,
            amountFormatted: `${finalPricePln.toLocaleString('pl-PL')} PLN`,
            nip: '7963033913',
            qrPayload: qrPayload
          },
          message: 'Rezerwacja terminu konsultacji przyjęta. Miejsce zablokowane na 24h.'
        }));
      } catch (err) {
        console.error('Błąd rezerwacji mentoringu:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Błąd serwera podczas rezerwacji.' }));
      }
    });
    return;
  }

  // -------------------------------------------------------------
  // API: LISTA REZERWOWA / WŁASNA PROPOZYCJA TERMINU -> ZAPIS + RESEND EMAIL
  // -------------------------------------------------------------
  // API: PROPOZYCJA TERMINU LUB ZAPIS NA LISTĘ OCZEKUJĄCYCH
  // -------------------------------------------------------------
  if (req.method === 'POST' && (reqPath === '/api/waitlist' || reqPath === '/api/propose-slot')) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { email, note, type, month, isProposal } = payload;

        if (!email) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Brak adresu e-mail.' }));
          return;
        }

        const isCustomProposal = Boolean(reqPath === '/api/propose-slot' || isProposal || (month && month.toLowerCase().includes('grudzień')));

        // 1. Zapis lokalny do pliku JSON
        saveJsonData('waitlist.json', {
          email,
          note: note || '',
          type: type || 'Mentoring biznesowy',
          month: month || 'Listopad 2026',
          isProposal: isCustomProposal
        });

        // 2. Natychmiastowe powiadomienie e-mail przez Resend do Łukasza
        try {
          sendWaitlistNotificationEmail({
            email,
            note,
            type: type || 'Mentoring biznesowy',
            month: month || 'Listopad 2026',
            isProposal: isCustomProposal
          }).catch(err => console.error('[Server] Błąd wysyłki e-mail waitlist:', err));
        } catch (e) {
          console.warn('[Server] Błąd przygotowania maila waitlist:', e.message);
        }

        // 3. Utworzenie wpisu w Cal.com
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
                name: `${isCustomProposal ? 'Propozycja Terminu' : 'Lista Rezerwowa'} (${type || 'Mentoring'})`,
                email: email,
                timeZone: 'Europe/Warsaw'
              },
              metadata: {
                notatka: note || 'Brak notatki',
                typ_mentoringu: type || 'Mentoring',
                miesiac: month || 'Bieżący',
                rodzaj: isCustomProposal ? 'Własna propozycja terminu' : 'Lista rezerwowa'
              }
            })
          });

          if (calRes.ok) {
            calWaitlistResult = await calRes.json();
          }
        } catch (calErr) {
          console.error('Cal.com waitlist API error:', calErr);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          message: isCustomProposal ? 'Dziękujemy! Twoja propozycja terminu została przekazana.' : 'Zapisano na listę rezerwową.',
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
  } else if (reqPath === '/regulamin' || reqPath === '/regulamin/') {
    reqPath = '/regulamin.html';
  } else if (reqPath === '/polityka-prywatnosci' || reqPath === '/polityka-prywatnosci/') {
    reqPath = '/polityka-prywatnosci.html';
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
