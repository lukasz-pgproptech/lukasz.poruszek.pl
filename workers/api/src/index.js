/**
 * Cloudflare Worker – lukasz.poruszek.pl API
 * Pełna obsługa API dla lukasz.poruszek.pl:
 *   - GET  /api/mentoring-slots
 *   - GET  /api/nip/:nip
 *   - POST /api/validate-coupon
 *   - POST /api/reserve-workshop
 *   - POST /api/reserve-mentoring
 *   - POST /api/waitlist
 *   - POST /api/propose-slot
 *   - GET  /api/invoices/:id
 */

const CAL_API_KEY = 'cal_live_c60e9d492b4c6ca4e69f6901d24b94b5';
const WORKSHOP_EVENT_TYPE_ID = 7790358;
const WAITLIST_EVENT_TYPE_ID = 7791068;
const ADMIN_EMAIL = 'lukasz.main@gmail.com';

const BASE_WORKSHOP_PRICE = 1200;
const BASE_MENTORING_PRICE = 400;

const COUPONS = {
  'CHORWACJA': 50,
  'RESICRAFT': 50,
  '432834145': 100
};

export const SELLER_DATA = {
  nip: '7963033913',
  name: 'POLSKA GRUPA PROPTECH SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
  street: 'ul. Jacka Malczewskiego 29',
  postalCode: '26-600',
  city: 'Radom',
  countryCode: 'PL',
  krs: '0001147224',
  regon: '540528562',
  bankAccount: '46 1140 2004 0000 3902 8547 5429',
  rawAccount: '46114020040000390285475429'
};

export const DECEMBER_HOLIDAYS = [24, 25, 26, 31];
const DAILY_HOURS = ['15:00', '16:30', '18:00'];

// Standard Rekomendacji ZBP 2D QR dla polskich aplikacji bankowych
export function generateZbpBankQrPayload({ nip = '7963033913', accountRaw, amountPln, recipientShort = 'PG Proptech Sp z oo', title }) {
  const cleanAccount = String(accountRaw || '').replace(/\D/g, '');
  const cleanNip = String(nip || '').replace(/\D/g, '');
  const amountGrosze = Math.round(Number(amountPln || 0) * 100);
  const formattedAmount = String(amountGrosze).padStart(6, '0');

  const cleanRecipient = String(recipientShort || 'PG Proptech Sp z oo')
    .replace(/\|/g, '')
    .trim()
    .slice(0, 20);

  const cleanTitle = String(title || 'Przelew')
    .replace(/\|/g, '')
    .trim()
    .slice(0, 32);

  const fields = [
    cleanNip,
    'PL',
    cleanAccount,
    formattedAmount,
    cleanRecipient,
    cleanTitle,
    '',
    '',
    ''
  ];

  return fields.join('|');
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders() },
  });
}

function html(content, status = 200) {
  return new Response(content, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders() },
  });
}

// --------------------------------------------------------------------------
// MENTORING SLOTS (GRUDZIEŃ 2026) Z UTRZYMANIEM W KV
// --------------------------------------------------------------------------
function createInitialDecemberSlots() {
  const slots = {};
  const year = 2026;
  const month = 11;
  const daysInMonth = 31;

  const workingDays = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const dayOfWeek = d.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const isHoliday = DECEMBER_HOLIDAYS.includes(day);

    if (!isWeekend && !isHoliday) {
      workingDays.push(day);
    }
  }

  workingDays.forEach(day => {
    DAILY_HOURS.forEach(time => {
      const dayStr = String(day).padStart(2, '0');
      const id = `2026-12-${dayStr}_${time}`;
      slots[id] = {
        id,
        day,
        date: `2026-12-${dayStr}`,
        time,
        status: 'fake_booked',
        bookedBy: null
      };
    });
  });

  const initialAvailableIds = [
    '2026-12-01_16:30',
    '2026-12-02_15:00',
    '2026-12-03_18:00',
    '2026-12-04_15:00',
    '2026-12-07_16:30',
    '2026-12-08_15:00',
    '2026-12-09_18:00',
    '2026-12-10_15:00',
    '2026-12-11_16:30',
    '2026-12-14_18:00',
    '2026-12-15_15:00',
    '2026-12-16_16:30',
    '2026-12-17_18:00',
    '2026-12-18_15:00',
    '2026-12-21_16:30',
    '2026-12-22_15:00',
    '2026-12-23_18:00',
    '2026-12-28_15:00'
  ];

  initialAvailableIds.forEach(id => {
    if (slots[id]) {
      slots[id].status = 'available';
    }
  });

  return slots;
}

async function loadDecemberSlots(env) {
  if (!env.RESERVATIONS) {
    return createInitialDecemberSlots();
  }
  const cached = await env.RESERVATIONS.get('mentoring_slots_2026_12', { type: 'json' });
  if (cached) return cached;

  const initial = createInitialDecemberSlots();
  await env.RESERVATIONS.put('mentoring_slots_2026_12', JSON.stringify(initial));
  return initial;
}

async function saveDecemberSlots(env, slots) {
  if (env.RESERVATIONS) {
    await env.RESERVATIONS.put('mentoring_slots_2026_12', JSON.stringify(slots));
  }
}

async function getPublicDecemberSlots(env) {
  const slots = await loadDecemberSlots(env);
  const publicList = {};

  Object.values(slots).forEach(s => {
    publicList[s.id] = {
      id: s.id,
      day: s.day,
      date: s.date,
      time: s.time,
      isAvailable: s.status === 'available',
      status: s.status === 'available' ? 'available' : 'booked'
    };
  });

  return publicList;
}

async function bookMentoringSlot(env, { slotId, name, email, phone, reservationId }) {
  const slots = await loadDecemberSlots(env);
  const normalizedId = String(slotId || '').replace(/^(\d{4}-\d{2}-\d{2})[-_](\d{2}:\d{2})$/, '$1_$2');
  const target = slots[slotId] || slots[normalizedId];

  if (!target) {
    return { success: false, error: 'Nie znaleziono wybranego terminu.' };
  }

  if (target.status !== 'available') {
    return { success: false, error: 'Wybrany termin został już zarezerwowany.' };
  }

  target.status = 'real_booked';
  target.bookedBy = {
    name,
    email,
    phone: phone || '',
    reservationId,
    bookedAt: new Date().toISOString()
  };

  const fakeBookedIds = Object.keys(slots).filter(id => slots[id].status === 'fake_booked');
  let replenishedSlotId = null;

  if (fakeBookedIds.length > 0) {
    const randomIndex = Math.floor(Math.random() * fakeBookedIds.length);
    replenishedSlotId = fakeBookedIds[randomIndex];
    slots[replenishedSlotId].status = 'available';
  }

  await saveDecemberSlots(env, slots);

  return {
    success: true,
    slot: target,
    replenishedSlotId
  };
}

// --------------------------------------------------------------------------
// PROFORMA INVOICE GENERATOR & NUMBERING
// --------------------------------------------------------------------------
async function getNextInvoiceNumber(env) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const monthKey = `${year}-${month}`;

  let currentIdx = 25;
  if (env.RESERVATIONS) {
    const counters = (await env.RESERVATIONS.get('invoices_counter', { type: 'json' })) || {};
    currentIdx = (counters[monthKey] || 24) + 1;
    counters[monthKey] = currentIdx;
    await env.RESERVATIONS.put('invoices_counter', JSON.stringify(counters));
  }

  const seq = String(currentIdx).padStart(3, '0');
  return `LP/${year}/${month}/${seq}`;
}

export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function generateInvoiceHtml(invoice) {
  const { invoiceNumber, issueDate, dueDate, seller, buyer, items, totalNet, totalVat, totalGross, paymentMethod } = invoice;

  const safeBuyerName = escapeHtml(buyer.companyName || buyer.name || '');
  const safeBuyerNip = escapeHtml(buyer.nip || '');
  const safeBuyerStreet = escapeHtml(buyer.street || '');
  const safeBuyerPostalCode = escapeHtml(buyer.postalCode || '');
  const safeBuyerCity = escapeHtml(buyer.city || '');
  const safeBuyerEmail = escapeHtml(buyer.email || '');

  const itemsRows = (items || []).map((it, idx) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">${idx + 1}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">
        <strong>${escapeHtml(it.name)}</strong>
        ${it.description ? `<div style="font-size: 11px; color: #64748b; margin-top: 3px;">${escapeHtml(it.description)}</div>` : ''}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: center;">${it.quantity} ${escapeHtml(it.unit || 'szt.')}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: right;">${Number(it.unitPriceNet).toFixed(2)} PLN</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: right;">${Number(it.netAmount).toFixed(2)} PLN</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: center;">${it.vatRate}%</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: right;">${Number(it.vatAmount).toFixed(2)} PLN</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: right; font-weight: 700;">${Number(it.grossAmount).toFixed(2)} PLN</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FAKTURA PROFORMA ${escapeHtml(invoiceNumber)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0f172a; background: #f8fafc; padding: 40px 20px; }
    .invoice-card { max-width: 820px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 48px; box-shadow: 0 10px 25px rgba(0,0,0,0.04); }
    .inv-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 24px; margin-bottom: 32px; }
    .inv-title { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: #0f172a; }
    .inv-number { font-size: 14px; color: #475569; margin-top: 4px; font-family: monospace; }
    .inv-dates { font-size: 12px; color: #475569; text-align: right; line-height: 1.6; }
    .parties-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 32px; }
    .party-col h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    .party-name { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
    .party-details { font-size: 12px; color: #475569; line-height: 1.6; }
    .table-container { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; margin-bottom: 32px; }
    .table-wrap { width: 100%; min-width: 620px; border-collapse: collapse; }
    .table-wrap th { background: #f1f5f9; padding: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; text-align: left; }
    .totals-box { margin-left: auto; width: 320px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; background: #f8fafc; margin-bottom: 32px; }
    .total-row { display: flex; justify-content: space-between; font-size: 12px; color: #475569; margin-bottom: 6px; }
    .total-row.grand { font-size: 15px; font-weight: 800; color: #0f172a; border-top: 2px solid #0f172a; padding-top: 8px; margin-top: 8px; margin-bottom: 0; }
    .payment-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px; font-size: 12px; line-height: 1.6; color: #1e293b; }
    .payment-title { font-weight: 700; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; color: #0f172a; margin-bottom: 6px; }
    .inv-footer { margin-top: 40px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; }
    @media (max-width: 640px) {
      body { padding: 12px 8px; }
      .invoice-card { padding: 20px 14px; border-radius: 8px; }
      .inv-header { flex-direction: column; gap: 14px; }
      .inv-dates { text-align: left; }
      .parties-grid { grid-template-columns: 1fr; gap: 20px; }
      .totals-box { width: 100%; margin-left: 0; }
    }
    @media print { body { background: #ffffff; padding: 0; } .invoice-card { border: none; box-shadow: none; padding: 0; } }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="inv-header">
      <div>
        <h1 class="inv-title">FAKTURA PROFORMA</h1>
        <div class="inv-number">Numer: ${escapeHtml(invoiceNumber)}</div>
      </div>
      <div class="inv-dates">
        <div><strong>Data wystawienia:</strong> ${escapeHtml(issueDate)}</div>
        <div><strong>Termin płatności:</strong> ${escapeHtml(dueDate)}</div>
        <div><strong>Metoda płatności:</strong> ${escapeHtml(paymentMethod || 'Przelew bankowy')}</div>
      </div>
    </div>

    <div class="parties-grid">
      <div class="party-col">
        <h4>Sprzedawca</h4>
        <div class="party-name">${escapeHtml(seller.name)}</div>
        <div class="party-details">
          NIP: <strong>${escapeHtml(seller.nip)}</strong><br>
          ${escapeHtml(seller.street)}<br>
          ${escapeHtml(seller.postalCode)} ${escapeHtml(seller.city)}<br>
          KRS: ${escapeHtml(seller.krs || '-')} • REGON: ${escapeHtml(seller.regon || '-')}
        </div>
      </div>
      <div class="party-col">
        <h4>Nabywca</h4>
        <div class="party-name">${safeBuyerName}</div>
        <div class="party-details">
          ${safeBuyerNip ? `NIP: <strong>${safeBuyerNip}</strong><br>` : ''}
          ${safeBuyerStreet ? `${safeBuyerStreet}<br>` : ''}
          ${safeBuyerPostalCode || safeBuyerCity ? `${safeBuyerPostalCode} ${safeBuyerCity}<br>` : ''}
          E-mail: ${safeBuyerEmail || '-'}
        </div>
      </div>
    </div>

    <div class="table-container">
      <table class="table-wrap">
        <thead>
          <tr>
            <th>Lp.</th>
            <th>Nazwa usługi</th>
            <th style="text-align: center;">Ilość</th>
            <th style="text-align: right;">Cena netto</th>
            <th style="text-align: right;">Wartość netto</th>
            <th style="text-align: center;">VAT</th>
            <th style="text-align: right;">Kwota VAT</th>
            <th style="text-align: right;">Wartość brutto</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>
    </div>

    <div class="totals-box">
      <div class="total-row"><span>Suma netto:</span><span>${Number(totalNet).toFixed(2)} PLN</span></div>
      <div class="total-row"><span>Kwota VAT (23%):</span><span>${Number(totalVat).toFixed(2)} PLN</span></div>
      <div class="total-row grand"><span>Do zapłaty:</span><span>${Number(totalGross).toFixed(2)} PLN</span></div>
    </div>

    <div class="payment-box">
      <div class="payment-title">Dane do płatności przelewem bankowym</div>
      <div>Odbiorca: <strong>${escapeHtml(seller.name)}</strong></div>
      <div>Numer rachunku: <strong>${escapeHtml(seller.bankAccount)}</strong></div>
      <div>Tytuł przelewu: <strong>${escapeHtml(invoice.transferTitle || `Proforma ${invoiceNumber}`)}</strong></div>
      <div>Kwota: <strong>${Number(totalGross).toFixed(2)} PLN</strong></div>
    </div>

    <div class="inv-footer">
      Dokument wygenerowany elektronicznie w standardzie e-Faktury (KSeF). Po zaksięgowaniu wpłaty zostanie wystawiona i przesłana faktura VAT.
    </div>
  </div>
</body>
</html>`;
}

// --------------------------------------------------------------------------
// RESEND EMAIL DISPATCH
// --------------------------------------------------------------------------
async function sendReservationEmail({ to, name, group, amountPln, invoiceNumber, invoiceId, invoiceHtml, transfer, isZeroPayment, buyer }, env) {
  const apiKey = (env && env.RESEND_API_KEY) ? env.RESEND_API_KEY : '';
  if (!apiKey) {
    console.warn('[Resend] Brak RESEND_API_KEY w env.');
    return { success: false, error: 'Brak klucza API' };
  }
  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0f172a;">
      <h2 style="color: #0f172a; margin-top: 0;">Dziękujemy za rezerwację!</h2>
      <p>Cześć <strong>${escapeHtml(name)}</strong>,</p>
      <p>Twoja rezerwacja na <strong>${escapeHtml(group)}</strong> została pomyślnie zarejestrowana.</p>

      ${isZeroPayment ? `
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <h4 style="margin: 0 0 8px; color: #166534;">Rezerwacja bezpłatna (Rabat 100%)</h4>
          <p style="margin: 0; font-size: 13px; color: #15803d;">Twoje miejsce zostało potwierdzone bez konieczności opłaty.</p>
        </div>
      ` : `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0;">
          <h4 style="margin: 0 0 12px; color: #0f172a;">Dane do przelewu (Faktura Proforma: ${invoiceNumber})</h4>
          <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <tr><td style="padding: 4px 0; color: #64748b;">Kwota do zapłaty:</td><td style="padding: 4px 0; font-weight: 700; font-size: 16px; color: #0f172a;">${amountPln.toFixed(2)} PLN</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Odbiorca:</td><td style="padding: 4px 0;"><strong>${transfer?.recipient || SELLER_DATA.name}</strong></td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Numer rachunku:</td><td style="padding: 4px 0; font-family: monospace; font-size: 13px;"><strong>${transfer?.account || SELLER_DATA.bankAccount}</strong></td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Tytuł przelewu:</td><td style="padding: 4px 0;"><strong>${transfer?.title || `Proforma ${invoiceNumber}`}</strong></td></tr>
          </table>
          <div style="margin-top: 14px;">
            <a href="https://lukasz.poruszek.pl/api/invoices/${invoiceId}" style="display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 600;">
              Otwórz i pobierz Fakturę Proforma Online →
            </a>
          </div>
        </div>
      `}

      <p style="font-size: 13px; color: #475569; margin-top: 24px;">
        W załączniku tej wiadomości znajduje się faktura proforma w formacie HTML do pobrania i archiwizacji.
      </p>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
      <p style="font-size: 11px; color: #94a3b8; margin: 0;">
        Wiadomość wygenerowana automatycznie przez system rezerwacji lukasz.poruszek.pl.
      </p>
    </div>
  `;

  try {
    const rawHtmlBytes = new TextEncoder().encode(invoiceHtml);
    let base64Content = '';
    const bytes = new Uint8Array(rawHtmlBytes);
    for (let i = 0; i < bytes.byteLength; i++) {
      base64Content += String.fromCharCode(bytes[i]);
    }
    const b64 = btoa(base64Content);

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Łukasz Poruszek <kontakt@poruszek.pl>',
        to: [to],
        reply_to: 'kontakt@pgproptech.com',
        subject: `Potwierdzenie rezerwacji i faktura proforma ${invoiceNumber}`,
        html: emailHtml,
        attachments: [
          {
            filename: `Faktura_Proforma_${invoiceNumber.replace(/\//g, '_')}.html`,
            content: b64
          }
        ]
      })
    });
    return { success: res.ok };
  } catch (err) {
    console.warn('[Resend] Błąd wysyłki e-mail:', err);
    return { success: false, error: err.message };
  }
}

// --------------------------------------------------------------------------
// ROUTER GŁÓWNY WORKERA
// --------------------------------------------------------------------------
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    // 1. GET /api/payment-config
    if (request.method === 'GET' && path === '/api/payment-config') {
      return json({
        success: true,
        mode: 'bank_transfer',
        blikSupported: true
      });
    }

    // 2. GET /api/mentoring-slots
    if (request.method === 'GET' && path === '/api/mentoring-slots') {
      const publicSlots = await getPublicDecemberSlots(env);
      return json({
        success: true,
        month: '2026-12',
        holidays: DECEMBER_HOLIDAYS,
        slots: publicSlots
      });
    }

    // 3. GET /api/nip/:nip oraz GET /api/nip-lookup?nip=...
    if (request.method === 'GET' && (path.startsWith('/api/nip/') || path === '/api/nip-lookup')) {
      const rawNip = path === '/api/nip-lookup'
        ? (url.searchParams.get('nip') || '')
        : path.replace('/api/nip/', '');
      const nip = String(rawNip).replace(/\D/g, '');
      if (nip.length !== 10) {
        return json({ success: false, error: 'Nieprawidłowy NIP. Wymagane 10 cyfr.' }, 400);
      }

      const today = new Date().toISOString().split('T')[0];
      try {
        const mfRes = await fetch(`https://wl-api.mf.gov.pl/api/search/nip/${nip}?date=${today}`, {
          headers: { 'User-Agent': 'lukasz.poruszek.pl-verifier' }
        });

        if (!mfRes.ok) {
          return json({ success: false, error: 'Podmiot nie został odnaleziony w rejestrze VAT MF.' }, 404);
        }

        const mfData = await mfRes.json();
        const subject = mfData?.result?.subject;
        if (!subject) {
          return json({ success: false, error: 'Brak danych podmiotu w odpowiedzi MF.' }, 404);
        }

        let street = '';
        let postalCode = '';
        let city = '';
        const rawAddr = subject.workingAddress || subject.residenceAddress || '';
        const match = rawAddr.match(/^(.+?),\s*(\d{2}-\d{3})\s+(.+)$/);
        if (match) {
          street = match[1].trim();
          postalCode = match[2].trim();
          city = match[3].trim();
        } else {
          street = rawAddr;
        }

        return json({
          success: true,
          nip: subject.nip,
          name: subject.name,
          street,
          postalCode,
          city,
          statusVat: subject.statusVat,
          krs: subject.krs || '',
          regon: subject.regon || ''
        });
      } catch (err) {
        return json({ success: false, error: 'Błąd połączenia z rejestrem MF.' }, 502);
      }
    }

    // 3. POST /api/validate-coupon
    if (request.method === 'POST' && path === '/api/validate-coupon') {
      let body = {};
      try { body = await request.json(); } catch {}
      const rawCode = body.code || body.coupon || '';
      const code = String(rawCode).trim().toUpperCase();

      if (!code) {
        return json({ valid: false, message: 'Brak kodu.' });
      }

      const discount = COUPONS[code];
      if (discount !== undefined) {
        return json({
          valid: true,
          code,
          discountPercent: discount,
          message: discount === 100 ? 'Kod poprawny! Rabat 100% (bezpłatnie).' : `Kod poprawny! Rabat ${discount}%.`
        });
      } else {
        return json({ valid: false, message: 'Nieprawidłowy kod rabatowy.' });
      }
    }

    // 4. POST /api/reserve-workshop
    if (request.method === 'POST' && path === '/api/reserve-workshop') {
      let payload = {};
      try { payload = await request.json(); } catch { return json({ error: 'Nieprawidłowy JSON' }, 400); }

      const { name, email, phone, group, groupId, coupon, buyerType, invoiceNip, invoiceCompanyName, invoiceStreet, invoicePostalCode, invoiceCity } = payload;
      if (!email || !name) {
        return json({ error: 'Brak imienia lub adresu e-mail.' }, 400);
      }

      const selectedGroup = group || 'Grupa grudniowa (start 1.12.2026, 19:00)';
      let discountPercent = 0;
      const normalizedCoupon = coupon ? String(coupon).trim().toUpperCase() : null;
      if (normalizedCoupon && COUPONS[normalizedCoupon] !== undefined) {
        discountPercent = COUPONS[normalizedCoupon];
      }

      const finalPricePln = Math.max(0, Math.round(BASE_WORKSHOP_PRICE * (1 - discountPercent / 100)));
      const invoiceId = `inv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const invoiceNumber = await getNextInvoiceNumber(env);

      const netPrice = Math.round((finalPricePln / 1.23) * 100) / 100;
      const vatPrice = Math.round((finalPricePln - netPrice) * 100) / 100;

      const buyer = {
        type: buyerType === 'company' ? 'company' : 'individual',
        name,
        companyName: buyerType === 'company' ? (invoiceCompanyName || name) : '',
        nip: buyerType === 'company' ? String(invoiceNip || '').replace(/\D/g, '') : '',
        street: invoiceStreet || '',
        postalCode: invoicePostalCode || '',
        city: invoiceCity || '',
        email
      };

      const invoiceData = {
        invoiceId,
        invoiceNumber,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0],
        seller: SELLER_DATA,
        buyer,
        items: [
          {
            name: `Warsztaty AI – ${selectedGroup}`,
            quantity: 1,
            unit: 'usł.',
            unitPriceNet: netPrice,
            netAmount: netPrice,
            vatRate: 23,
            vatAmount: vatPrice,
            grossAmount: finalPricePln
          }
        ],
        totalNet: netPrice,
        totalVat: vatPrice,
        totalGross: finalPricePln,
        paymentMethod: 'Przelew bankowy',
        transferTitle: `Warsztaty AI ${invoiceNumber}`
      };

      const invoiceHtml = generateInvoiceHtml(invoiceData);

      if (env.RESERVATIONS) {
        await env.RESERVATIONS.put(`invoice:${invoiceId}`, JSON.stringify(invoiceData));
        await env.RESERVATIONS.put(`reservation:ws:${Date.now()}`, JSON.stringify({
          type: 'workshop',
          group: selectedGroup,
          name,
          email,
          finalPricePln,
          invoiceNumber,
          createdAt: new Date().toISOString()
        }));
      }

      const rawAccount = SELLER_DATA.rawAccount;
      const transferTitle = `Warsztaty AI ${invoiceNumber}`;
      const recipientName = SELLER_DATA.name;
      const recipientShort = 'PG Proptech Sp z oo';

      const qrPayload = generateZbpBankQrPayload({
        nip: '7963033913',
        accountRaw: rawAccount,
        amountPln: finalPricePln,
        recipientShort,
        title: transferTitle
      });

      // Wysyłka Resend w tle
      sendReservationEmail({
        to: email,
        name,
        group: `Warsztaty AI (${selectedGroup})`,
        amountPln: finalPricePln,
        invoiceNumber,
        invoiceId,
        invoiceHtml,
        transfer: {
          account: SELLER_DATA.bankAccount,
          recipient: recipientName,
          title: transferTitle
        },
        isZeroPayment: finalPricePln === 0,
        buyer
      }, env);

      return json({
        success: true,
        paymentMode: 'bank_transfer',
        amountPln: finalPricePln,
        invoiceNumber,
        invoiceUrl: `/api/invoices/${invoiceId}`,
        invoice: {
          invoiceId,
          invoiceNumber,
          downloadUrl: `/api/invoices/${invoiceId}`
        },
        transfer: {
          recipient: recipientName,
          recipientShort,
          account: SELLER_DATA.bankAccount,
          accountFormatted: SELLER_DATA.bankAccount,
          accountRaw: rawAccount,
          rawAccount,
          title: transferTitle,
          amount: finalPricePln,
          amountFormatted: `${finalPricePln.toFixed(2)} PLN`,
          qrPayload
        }
      });
    }

    // 5. POST /api/reserve-mentoring
    if (request.method === 'POST' && path === '/api/reserve-mentoring') {
      let payload = {};
      try { payload = await request.json(); } catch { return json({ error: 'Nieprawidłowy JSON' }, 400); }

      const { name, email, phone, slotId, type, date, time, coupon, buyerType, invoiceNip, invoiceCompanyName, invoiceStreet, invoicePostalCode, invoiceCity } = payload;
      if (!email || !name || !slotId) {
        return json({ error: 'Brak wymaganych danych rezerwacji (imię, e-mail, termin).' }, 400);
      }

      let discountPercent = 0;
      const normalizedCoupon = coupon ? String(coupon).trim().toUpperCase() : null;
      if (normalizedCoupon && COUPONS[normalizedCoupon] !== undefined) {
        discountPercent = COUPONS[normalizedCoupon];
      }

      const finalPricePln = Math.max(0, Math.round(BASE_MENTORING_PRICE * (1 - discountPercent / 100)));
      const invoiceId = `inv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const invoiceNumber = await getNextInvoiceNumber(env);

      // Book slot w KV
      const bookRes = await bookMentoringSlot(env, {
        slotId,
        name,
        email,
        phone: phone || '',
        reservationId: invoiceNumber
      });

      if (!bookRes.success) {
        return json({ error: bookRes.error || 'Termin nie jest już dostępny.' }, 409);
      }

      const netPrice = Math.round((finalPricePln / 1.23) * 100) / 100;
      const vatPrice = Math.round((finalPricePln - netPrice) * 100) / 100;

      const buyer = {
        type: buyerType === 'company' ? 'company' : 'individual',
        name,
        companyName: buyerType === 'company' ? (invoiceCompanyName || name) : '',
        nip: buyerType === 'company' ? String(invoiceNip || '').replace(/\D/g, '') : '',
        street: invoiceStreet || '',
        postalCode: invoicePostalCode || '',
        city: invoiceCity || '',
        email
      };

      const invoiceData = {
        invoiceId,
        invoiceNumber,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0],
        seller: SELLER_DATA,
        buyer,
        items: [
          {
            name: `${type || 'Mentoring 1:1'} (${date || ''}, ${time || ''})`,
            quantity: 1,
            unit: 'usł.',
            unitPriceNet: netPrice,
            netAmount: netPrice,
            vatRate: 23,
            vatAmount: vatPrice,
            grossAmount: finalPricePln
          }
        ],
        totalNet: netPrice,
        totalVat: vatPrice,
        totalGross: finalPricePln,
        paymentMethod: 'Przelew bankowy',
        transferTitle: `Mentoring ${invoiceNumber}`
      };

      const invoiceHtml = generateInvoiceHtml(invoiceData);

      if (env.RESERVATIONS) {
        await env.RESERVATIONS.put(`invoice:${invoiceId}`, JSON.stringify(invoiceData));
        await env.RESERVATIONS.put(`reservation:mentoring:${Date.now()}`, JSON.stringify({
          type: 'mentoring',
          slotId,
          date,
          time,
          name,
          email,
          finalPricePln,
          invoiceNumber,
          createdAt: new Date().toISOString()
        }));
      }

      const rawAccount = SELLER_DATA.rawAccount;
      const transferTitle = `Mentoring ${invoiceNumber}`;
      const recipientName = SELLER_DATA.name;
      const recipientShort = 'PG Proptech Sp z oo';

      const qrPayload = generateZbpBankQrPayload({
        nip: '7963033913',
        accountRaw: rawAccount,
        amountPln: finalPricePln,
        recipientShort,
        title: transferTitle
      });

      sendReservationEmail({
        to: email,
        name,
        group: `${type || 'Mentoring 1:1'} – ${date || ''}, godz. ${time || ''}`,
        amountPln: finalPricePln,
        invoiceNumber,
        invoiceId,
        invoiceHtml,
        transfer: {
          account: SELLER_DATA.bankAccount,
          recipient: recipientName,
          title: transferTitle
        },
        isZeroPayment: finalPricePln === 0,
        buyer
      }, env);

      return json({
        success: true,
        paymentMode: 'bank_transfer',
        amountPln: finalPricePln,
        replenishedSlotId: bookRes.replenishedSlotId,
        invoiceNumber,
        invoiceUrl: `/api/invoices/${invoiceId}`,
        invoice: {
          invoiceId,
          invoiceNumber,
          downloadUrl: `/api/invoices/${invoiceId}`
        },
        transfer: {
          recipient: recipientName,
          recipientShort,
          account: SELLER_DATA.bankAccount,
          accountFormatted: SELLER_DATA.bankAccount,
          accountRaw: rawAccount,
          rawAccount,
          title: transferTitle,
          amount: finalPricePln,
          amountFormatted: `${finalPricePln.toFixed(2)} PLN`,
          qrPayload
        }
      });
    }

    // 6. POST /api/propose-slot
    if (request.method === 'POST' && path === '/api/propose-slot') {
      let body = {};
      try { body = await request.json(); } catch {}
      const { email, note, type, month } = body;

      if (!email) {
        return json({ error: 'Brak adresu e-mail.' }, 400);
      }

      if (env.RESERVATIONS) {
        await env.RESERVATIONS.put(`proposal:${Date.now()}`, JSON.stringify({
          email,
          note: note || '',
          type: type || 'Mentoring',
          month: month || '2026-12',
          createdAt: new Date().toISOString()
        }));
      }

      // Powiadomienie na Resend do admina
      try {
        const apiKey = (env && env.RESEND_API_KEY) ? env.RESEND_API_KEY : '';
        if (apiKey) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'Łukasz Poruszek <kontakt@poruszek.pl>',
              to: [ADMIN_EMAIL],
              subject: `[Propozycja terminu] Nowe zgłoszenie od ${escapeHtml(email)}`,
              html: `
                <h3>Nowa propozycja terminu mentoringu</h3>
                <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
                <p><strong>Typ:</strong> ${escapeHtml(type || 'Mentoring')}</p>
                <p><strong>Miesiąc:</strong> ${escapeHtml(month || '2026-12')}</p>
                <p><strong>Proponowany termin / Notatka:</strong></p>
                <blockquote style="background:#f1f5f9;padding:12px;border-left:4px solid #0f172a;">${escapeHtml(note || 'Brak dodatkowej notatki')}</blockquote>
              `
            })
          });
        }
      } catch (e) {}

      return json({ success: true, message: 'Propozycja terminu została przyjęta.' });
    }

    // 7. POST /api/waitlist
    if (request.method === 'POST' && path === '/api/waitlist') {
      let body = {};
      try { body = await request.json(); } catch {}
      const { email, note, type, month } = body;

      if (!email) {
        return json({ error: 'Brak adresu e-mail.' }, 400);
      }

      if (env.RESERVATIONS) {
        await env.RESERVATIONS.put(`waitlist:${Date.now()}`, JSON.stringify({
          email,
          note: note || '',
          type: type || 'Mentoring',
          month: month || 'Bieżący',
          createdAt: new Date().toISOString()
        }));
      }

      // Cal.com sync
      try {
        const slotDate = new Date();
        slotDate.setUTCDate(slotDate.getUTCDate() + 1);
        slotDate.setUTCHours(12, 0, 0, 0);

        await fetch('https://api.cal.com/v2/bookings', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${CAL_API_KEY}`,
            'Content-Type': 'application/json',
            'cal-api-version': '2024-08-13',
          },
          body: JSON.stringify({
            eventTypeId: WAITLIST_EVENT_TYPE_ID,
            start: slotDate.toISOString(),
            attendee: {
              name: `Lista Rezerwowa (${type || 'Mentoring'})`,
              email,
              timeZone: 'Europe/Warsaw',
            },
            metadata: {
              notatka: note || 'Brak notatki',
              typ_mentoringu: type || 'Mentoring',
              miesiac: month || 'Bieżący',
              source: 'Lista rezerwowa lukasz.poruszek.pl',
            },
          }),
        });
      } catch (e) {}

      return json({ success: true, message: 'Zapisano na listę rezerwową.' });
    }

    // 8. GET /api/invoices/:id
    if (request.method === 'GET' && path.startsWith('/api/invoices/')) {
      const invId = path.replace('/api/invoices/', '').trim();
      let invoiceData = null;
      if (env.RESERVATIONS) {
        invoiceData = await env.RESERVATIONS.get(`invoice:${invId}`, { type: 'json' });
      }

      if (!invoiceData) {
        return html('<h1>Nie znaleziono faktury proforma.</h1><p>Dokument mógł wygasnąć lub identyfikator jest niepoprawny.</p>', 404);
      }

      const invoiceHtml = generateInvoiceHtml(invoiceData);
      return html(invoiceHtml);
    }

    return json({ error: 'Not found' }, 404);
  },
};
