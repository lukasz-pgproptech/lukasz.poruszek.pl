/**
 * Cloudflare Worker – lukasz.poruszek.pl API
 * Obsługuje:
 *   POST /api/reserve-workshop  → zapis do KV + Cal.com booking
 *   POST /api/waitlist          → zapis do KV + Cal.com waitlist
 */

import crypto from 'node:crypto';

const CAL_API_KEY = 'cal_live_c60e9d492b4c6ca4e69f6901d24b94b5';
const WORKSHOP_EVENT_TYPE_ID = 7790358;
const WAITLIST_EVENT_TYPE_ID = 7791068;

const BASE_WORKSHOP_PRICE = 1200;
const COUPONS = {
  'CHORWACJA': 50,
  'RESICRAFT': 50,
  '432834145': 100
};

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
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

async function saveToKV(kv, namespace, entry) {
  const key = `${namespace}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  if (kv) {
    await kv.put(key, JSON.stringify({ ...entry, createdAt: new Date().toISOString() }));
  }
  return key;
}

async function handleReserveWorkshop(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Nieprawidłowy JSON.' }, 400);
  }

  const { name, email, phone, group, groupId, coupon } = payload;
  if (!email || !name) {
    return json({ error: 'Brak imienia lub adresu e-mail.' }, 400);
  }

  const selectedGroup = group || 'Grupa grudniowa (start 1.12.2026, 19:00)';
  const workshopDate = (groupId === 'january') ? '2027-01-05T18:00:00.000Z' : '2026-12-01T18:00:00.000Z';

  let discountPercent = 0;
  const normalizedCoupon = coupon ? String(coupon).trim().toUpperCase() : null;
  if (normalizedCoupon && COUPONS[normalizedCoupon] !== undefined) {
    discountPercent = COUPONS[normalizedCoupon];
  }

  const finalPricePln = Math.max(0, Math.round(BASE_WORKSHOP_PRICE * (1 - discountPercent / 100)));
  const finalPriceGrosze = finalPricePln * 100;
  const externalId = `ws-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  // SCENARIUSZ A: Kwota 0 PLN (100% rabatu)
  if (finalPricePln === 0) {
    await saveToKV(env.RESERVATIONS, 'reservation', {
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

    let calSynced = false;
    try {
      const calRes = await fetch('https://api.cal.com/v2/bookings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.CAL_API_KEY || CAL_API_KEY}`,
          'Content-Type': 'application/json',
          'cal-api-version': '2024-08-13',
        },
        body: JSON.stringify({
          eventTypeId: WORKSHOP_EVENT_TYPE_ID,
          start: workshopDate,
          attendee: {
            name,
            email,
            timeZone: 'Europe/Warsaw',
            ...(phone ? { phoneNumber: phone } : {}),
          },
          metadata: {
            source: 'lukasz.poruszek.pl',
            note: `Rezerwacja Warsztatów AI (${selectedGroup}) - Rabat 100% (Kod: ${normalizedCoupon})`,
          },
        }),
      });
      calSynced = calRes.ok;
    } catch (err) {
      console.error('Cal.com API error:', err);
    }

    return json({ success: true, isZeroPayment: true, message: 'Rezerwacja przyjęta bezpłatnie.', calSynced });
  }

  // SCENARIUSZ B: Płatność Paynow
  const paynowApiKey = env.PAYNOW_API_KEY;
  const paynowSignatureKey = env.PAYNOW_SIGNATURE_KEY;
  const paynowApiUrl = env.PAYNOW_ENV === 'sandbox' ? 'https://api.sandbox.paynow.pl' : 'https://api.paynow.pl';

  if (paynowApiKey && paynowSignatureKey) {
    try {
      const url = new URL(request.url);
      const origin = `${url.protocol}//${url.host}`;
      const idempotencyKey = crypto.randomUUID();
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

      const signature = calculatePaynowSignature(paynowApiKey, paynowSignatureKey, idempotencyKey, paymentPayload);

      const paynowRes = await fetch(`${paynowApiUrl}/v3/payments`, {
        method: 'POST',
        headers: {
          'Api-Key': paynowApiKey,
          'Signature': signature,
          'Idempotency-Key': idempotencyKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(paymentPayload)
      });

      const paynowData = await paynowRes.json();
      if (paynowRes.ok && paynowData.redirectUrl) {
        await saveToKV(env.RESERVATIONS, 'reservation', {
          event: 'Warsztaty AI',
          group: selectedGroup,
          name,
          email,
          phone: phone || '',
          coupon: normalizedCoupon,
          amountPln: finalPricePln,
          externalId,
          paymentId: paynowData.paymentId,
          paymentStatus: 'pending_paynow'
        });

        return json({
          success: true,
          redirectUrl: paynowData.redirectUrl,
          paymentId: paynowData.paymentId,
          amountPln: finalPricePln
        });
      } else {
        return json({ error: 'Błąd Paynow: ' + (paynowData.message || 'Spróbuj ponownie później.') }, 400);
      }
    } catch (payErr) {
      console.error('Paynow error:', payErr);
      return json({ error: 'Błąd połączenia z bramką płatności.' }, 500);
    }
  }

  // SCENARIUSZ C: Paynow nie skonfigurowane
  await saveToKV(env.RESERVATIONS, 'reservation', {
    event: 'Warsztaty AI',
    group: selectedGroup,
    name,
    email,
    phone: phone || '',
    coupon: normalizedCoupon,
    amountPln: finalPricePln,
    externalId,
    paymentStatus: 'pending_paynow_config'
  });

  return json({
    success: true,
    requiresConfig: true,
    amountPln: finalPricePln,
    message: 'Zgłoszenie zarejestrowane.'
  });
}

async function handleWaitlist(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Nieprawidłowy JSON.' }, 400);
  }

  const { email, note, type, month } = payload;
  if (!email) {
    return json({ error: 'Brak adresu e-mail.' }, 400);
  }

  // Zapis do KV
  await saveToKV(env.RESERVATIONS, 'waitlist', {
    email,
    note: note || '',
    type: type || 'Mentoring biznesowy',
    month: month || 'Listopad 2026',
  });

  // Cal.com waitlist entry
  let calSynced = false;
  try {
    const slotDate = new Date();
    slotDate.setUTCDate(slotDate.getUTCDate() + 1);
    slotDate.setUTCHours(12, 0, 0, 0);

    const calRes = await fetch('https://api.cal.com/v2/bookings', {
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
    calSynced = calRes.ok;
    if (!calRes.ok) {
      console.warn('Cal.com waitlist error:', calRes.status, await calRes.text());
    }
  } catch (err) {
    console.error('Cal.com waitlist API error:', err);
  }

  return json({ success: true, message: 'Zapisano na listę rezerwową.', calSynced });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Preflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (request.method === 'POST' && path === '/api/reserve-workshop') {
      return handleReserveWorkshop(request, env);
    }

    if (request.method === 'POST' && path === '/api/waitlist') {
      return handleWaitlist(request, env);
    }

    return json({ error: 'Not found' }, 404);
  },
};
