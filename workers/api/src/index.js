/**
 * Cloudflare Worker – lukasz.poruszek.pl API
 * Obsługuje:
 *   POST /api/reserve-workshop  → zapis do KV + Cal.com booking
 *   POST /api/waitlist          → zapis do KV + Cal.com waitlist
 */

const CAL_API_KEY = 'cal_live_c60e9d492b4c6ca4e69f6901d24b94b5';
const WORKSHOP_EVENT_TYPE_ID = 7790358;
const WAITLIST_EVENT_TYPE_ID = 7791068;

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
  await kv.put(key, JSON.stringify({ ...entry, createdAt: new Date().toISOString() }));
  return key;
}

async function handleReserveWorkshop(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Nieprawidłowy JSON.' }, 400);
  }

  const { name, email, phone } = payload;
  if (!email || !name) {
    return json({ error: 'Brak imienia lub adresu e-mail.' }, 400);
  }

  // Zapis do KV
  await saveToKV(env.RESERVATIONS, 'reservation', {
    event: 'Warsztaty AI',
    group: 'Grupa grudniowa (start 1.12.2026, 19:00)',
    name,
    email,
    phone: phone || '',
  });

  // Cal.com booking
  let calSynced = false;
  try {
    const calRes = await fetch('https://api.cal.com/v2/bookings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CAL_API_KEY}`,
        'Content-Type': 'application/json',
        'cal-api-version': '2024-08-13',
      },
      body: JSON.stringify({
        eventTypeId: WORKSHOP_EVENT_TYPE_ID,
        start: '2026-12-01T18:00:00.000Z',
        attendee: {
          name,
          email,
          timeZone: 'Europe/Warsaw',
          ...(phone ? { phoneNumber: phone } : {}),
        },
        metadata: {
          source: 'lukasz.poruszek.pl',
          note: 'Rezerwacja Warsztatów AI (Grupa grudniowa)',
        },
      }),
    });
    calSynced = calRes.ok;
    if (!calRes.ok) {
      console.warn('Cal.com workshop error:', calRes.status, await calRes.text());
    }
  } catch (err) {
    console.error('Cal.com API error:', err);
  }

  return json({ success: true, message: 'Rezerwacja przyjęta.', calSynced });
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
