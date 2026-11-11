/**
 * MENTORING SLOTS MANAGER (GRUDZIEŃ 2026)
 * Obsługa grafiku, 30% stałej puli wolnych terminów,
 * wykluczenia świąt (24, 25, 26, 31 grudnia) oraz mechanizmu
 * dynamicznego odblokowywania kolejnych terminów z puli "fake_booked"
 * po każdej realnej rezerwacji klienta.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const SLOTS_FILE = path.join(DATA_DIR, 'mentoring_slots_2026_12.json');

// Dni świąteczne w grudniu bez konsultacji
export const DECEMBER_HOLIDAYS = [24, 25, 26, 31];

const DAILY_HOURS = ['15:00', '16:30', '18:00'];

/**
 * Generuje początkową, stałą bazę terminów dla Grudnia 2026 (60 slotów, w tym ~30% = 18 wolnych).
 */
function createInitialDecemberSlots() {
  const slots = {};
  const year = 2026;
  const month = 11; // 0-indexed: grudzień
  const daysInMonth = 31;

  const workingDays = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const dayOfWeek = d.getDay(); // 0: niedz, 6: sob
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const isHoliday = DECEMBER_HOLIDAYS.includes(day);

    if (!isWeekend && !isHoliday) {
      workingDays.push(day);
    }
  }

  // Tworzymy wszystkie 60 slotów roboczych
  const allSlotIds = [];
  workingDays.forEach(day => {
    DAILY_HOURS.forEach(time => {
      const dayStr = String(day).padStart(2, '0');
      const id = `2026-12-${dayStr}_${time}`;
      allSlotIds.push(id);
      slots[id] = {
        id,
        day,
        date: `2026-12-${dayStr}`,
        time,
        status: 'fake_booked', // domyślnie zajęty
        bookedBy: null
      };
    });
  });

  // Deterministycznie wyznaczamy 18 wolnych terminów (30% z 60)
  // Równomiernie rozłożonych po całym grudniu dla wiarygodności
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

export function loadDecemberSlots() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(SLOTS_FILE)) {
    const initial = createInitialDecemberSlots();
    fs.writeFileSync(SLOTS_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }

  try {
    return JSON.parse(fs.readFileSync(SLOTS_FILE, 'utf8'));
  } catch (e) {
    console.error('[MentoringSlots] Błąd odczytu pliku slotów:', e);
    const initial = createInitialDecemberSlots();
    fs.writeFileSync(SLOTS_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
}

export function saveDecemberSlots(slots) {
  try {
    fs.writeFileSync(SLOTS_FILE, JSON.stringify(slots, null, 2), 'utf8');
  } catch (e) {
    console.error('[MentoringSlots] Błąd zapisu pliku slotów:', e);
  }
}

/**
 * Zwraca sloty dla klienta (frontend) - ukrywa czy termin jest "fake_booked" czy "real_booked".
 * Zwraca wyłącznie 'available' lub 'booked'.
 */
export function getPublicDecemberSlots() {
  const slots = loadDecemberSlots();
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

/**
 * Rezerwuje wybrany termin:
 * 1. Oznacza termin jako 'real_booked'
 * 2. Jeśli istnieją terminy 'fake_booked', losuje JEDEN i zamienia go na 'available',
 *    utrzymując bufor ~30% wolnych miejsc aż do wyczerpania fake'ów!
 */
export function bookMentoringSlot({ slotId, name, email, phone, reservationId }) {
  const slots = loadDecemberSlots();
  const target = slots[slotId];

  if (!target) {
    return { success: false, error: 'Nie znaleziono wybranego terminu.' };
  }

  if (target.status !== 'available') {
    return { success: false, error: 'Wybrany termin został już zarezerwowany.' };
  }

  // 1. Zapis realnego bookingu
  target.status = 'real_booked';
  target.bookedBy = {
    name,
    email,
    phone: phone || '',
    reservationId,
    bookedAt: new Date().toISOString()
  };

  // 2. Szukamy terminów fake_booked do odblokowania
  const fakeBookedIds = Object.keys(slots).filter(id => slots[id].status === 'fake_booked');
  let replenishedSlotId = null;

  if (fakeBookedIds.length > 0) {
    // Wybieramy losowy z puli fake_booked
    const randomIndex = Math.floor(Math.random() * fakeBookedIds.length);
    replenishedSlotId = fakeBookedIds[randomIndex];
    slots[replenishedSlotId].status = 'available';
    console.log(`[MentoringEngine] Zarezerwowano ${slotId} (REAL). Odblokowano nowy termin: ${replenishedSlotId} (Pozostało fake'ów: ${fakeBookedIds.length - 1})`);
  } else {
    console.log(`[MentoringEngine] Zarezerwowano ${slotId} (REAL). Pula fake_booked wyczerpana!`);
  }

  saveDecemberSlots(slots);

  return {
    success: true,
    slot: target,
    replenishedSlotId
  };
}
