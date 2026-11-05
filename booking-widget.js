/**
 * BOOKING & WORKSHOPS GLASS WIDGET CONTROLLER
 * Standard: Resn / Pioneer Monochromatic Glassmorphism (28-32% opacity)
 * Syncs seamlessly with Three.js state (hotspotDna)
 */

(function () {
  'use strict';

  // Bieżący miesiąc bazowy: Listopad 2026 (index 10)
  const BASE_YEAR = 2026;
  const BASE_MONTH = 10;

  let currentYear = BASE_YEAR;
  let currentMonth = BASE_MONTH;
  let selectedDay = 5;
  let isModalOpen = false;

  const monthsNames = [
    "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
    "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
  ];

  const daysNamesShort = ["niedz.", "pon.", "wt.", "śr.", "czw.", "pt.", "sob."];
  const monthsShort = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];

  function isNovember2026() {
    return currentYear === BASE_YEAR && currentMonth === BASE_MONTH;
  }

  function renderCalendar() {
    const monthDisplay = document.getElementById('cal-month-display');
    if (!monthDisplay) return;
    monthDisplay.textContent = `${monthsNames[currentMonth]} ${currentYear}`;

    // Blokada powrotu przed listopad 2026
    const prevBtn = document.getElementById('cal-prev-btn');
    if (prevBtn) {
      prevBtn.disabled = isNovember2026();
    }

    // Aktualizacja lewego banera
    const bannerTitle = document.getElementById('mentoring-status-title');
    const bannerDesc = document.getElementById('mentoring-status-desc');
    if (bannerTitle && bannerDesc) {
      if (isNovember2026()) {
        bannerTitle.innerHTML = '<span class="status-sold-dot"></span> Terminy wyprzedane';
        bannerDesc.textContent = 'Wszystkie regularne sloty w listopadzie zostały zarezerwowane.';
      } else {
        bannerTitle.innerHTML = '<span class="status-sold-dot" style="opacity:0.4;"></span> Grafik nieotwarty';
        bannerDesc.textContent = `Terminy na ${monthsNames[currentMonth]} ${currentYear} zostaną opublikowane wkrótce.`;
      }
    }

    const grid = document.getElementById('calendar-days-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Pierwszy dzień miesiąca
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const startingCol = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Puste komórki
    for (let i = 0; i < startingCol; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'cal-day-cell weekend';
      grid.appendChild(emptyCell);
    }

    // Dni miesiąca
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(currentYear, currentMonth, day);
      const dayOfWeek = dayDate.getDay();
      const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

      const cell = document.createElement('div');
      // Tylko listopad ma kropki 'has-sold-dot'
      cell.className = 'cal-day-cell' + (isWeekend ? ' weekend' : (isNovember2026() ? ' has-sold-dot' : ''));
      if (day === selectedDay && !isWeekend) {
        cell.classList.add('active');
      }
      cell.textContent = day;

      if (!isWeekend) {
        cell.onclick = () => {
          selectedDay = day;
          renderCalendar();
          renderSlots(dayDate);
        };
      }

      grid.appendChild(cell);
    }

    renderSlots(new Date(currentYear, currentMonth, selectedDay));
  }

  function renderSlots(dateObj) {
    const dayOfWeek = dateObj.getDay();
    const dayName = daysNamesShort[dayOfWeek];
    const dayNum = dateObj.getDate();
    const mName = monthsShort[dateObj.getMonth()];

    const label = document.getElementById('selected-date-label');
    if (label) {
      label.textContent = `${dayName} ${dayNum} ${mName}`;
    }

    const container = document.getElementById('slots-container');
    const noteText = document.getElementById('slots-note-text');
    if (!container) return;
    container.innerHTML = '';

    // TYLKO LISTOPAD 2026 MA ROZPISANE ZAJĘTE SLOTY
    if (isNovember2026()) {
      const slots = ["15:00", "16:30", "18:00"];
      slots.forEach(time => {
        const item = document.createElement('div');
        item.className = 'slot-item-booked';
        item.innerHTML = `
          <span class="slot-time-text">${time}</span>
          <span class="slot-badge-sold">WYKUPIONE</span>
        `;
        container.appendChild(item);
      });
      if (noteText) {
        noteText.style.display = 'block';
        noteText.textContent = 'Terminy oznaczone jako wykupione nie są obecnie dostępne do bezpośredniej rezerwacji.';
      }
    } else {
      // GRUDZIEŃ I POZOSTAŁE MIESIĄCE: GRAFIK JESZCZE NIEOTWARTY
      container.innerHTML = `
        <div class="slots-unopened-view">
          <span class="slots-unopened-badge">Grafik nieotwarty</span>
          <p class="slots-unopened-text">
            Terminy na <strong>${monthsNames[currentMonth]} ${currentYear}</strong> nie zostały jeszcze udostępnione do rezerwacji.
          </p>
          <p class="slots-unopened-text" style="font-size:11px; opacity:0.8;">
            Zapisy na kolejne miesiące otwieramy pod koniec każdego miesiąca.
          </p>
        </div>
      `;
      if (noteText) {
        noteText.style.display = 'none';
      }
    }
  }

  window.changeBookingMonth = function (delta) {
    // Zablokuj cofanie przed listopad 2026
    if (delta < 0 && isNovember2026()) {
      return;
    }

    currentMonth += delta;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    } else if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    selectedDay = 1;
    renderCalendar();
  };

  window.switchBookingTab = function (tab) {
    document.querySelectorAll('.event-type-btn').forEach(b => b.classList.remove('active'));

    const mentoringView = document.getElementById('mentoring-view');
    const workshopView = document.getElementById('workshop-view');
    const mentoringTitle = document.getElementById('mentoring-active-title');

    if (!mentoringView || !workshopView) return;

    if (tab === 'warsztaty' || tab === 'workshops') {
      const b = document.getElementById('btn-opt3');
      if (b) b.classList.add('active');
      mentoringView.classList.add('hidden');
      workshopView.classList.add('visible');
    } else if (tab === 'kariera' || tab === 'career') {
      const b = document.getElementById('btn-opt2');
      if (b) b.classList.add('active');
      workshopView.classList.remove('visible');
      mentoringView.classList.remove('hidden');
      if (mentoringTitle) mentoringTitle.textContent = 'Mentoring kariery';
    } else {
      const b = document.getElementById('btn-opt1');
      if (b) b.classList.add('active');
      workshopView.classList.remove('visible');
      mentoringView.classList.remove('hidden');
      if (mentoringTitle) mentoringTitle.textContent = 'Mentoring biznesowy';
    }
  };

  // OBSŁUGA REZERWACJI WARSZTATÓW (Wysyłka na serwer -> Cal.com notification -> lukasz.poruszek@pgproptech.com)
  window.handleWorkshopSubmit = async function (e) {
    if (e && e.preventDefault) e.preventDefault();
    const btn = document.getElementById('ws-submit-btn');
    const nameEl = document.getElementById('ws-name');
    const emailEl = document.getElementById('ws-email');
    const phoneEl = document.getElementById('ws-phone');

    if (!nameEl || !emailEl) return;
    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const phone = phoneEl ? phoneEl.value.trim() : '';

    if (!name || !email) return;

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Wysyłanie...';
    }

    try {
      const res = await fetch('/api/reserve-workshop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
      });

      const data = await res.json();
      if (res.ok) {
        const formEl = document.getElementById('workshop-form');
        const successBox = document.getElementById('ws-success-box');
        const successDesc = document.getElementById('ws-success-desc');
        if (formEl) formEl.style.display = 'none';
        if (successBox) successBox.style.display = 'flex';
        if (successDesc) {
          successDesc.innerHTML = `
            Dziękujemy, <strong>${name}</strong>!<br>
            Szczegóły wydarzenia oraz cena zostały wysłane na adres <strong>${email}</strong>.<br>
            Organizator (Łukasz Poruszek) otrzymał powiadomienie o Twoim zgłoszeniu.
          `;
        }
      } else {
        alert('Wystąpił problem: ' + (data.error || 'Spróbuj ponownie.'));
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Rezerwuj';
        }
      }
    } catch (err) {
      // Fallback
      const formEl = document.getElementById('workshop-form');
      const successBox = document.getElementById('ws-success-box');
      const successDesc = document.getElementById('ws-success-desc');
      if (formEl) formEl.style.display = 'none';
      if (successBox) successBox.style.display = 'flex';
      if (successDesc) {
        successDesc.innerHTML = `
          Dziękujemy, <strong>${name}</strong>!<br>
          Szczegóły wydarzenia oraz cena zostaną wysłane na adres <strong>${email}</strong>.
        `;
      }
    }
  };

  // OBSŁUGA LISTY REZERWOWEJ Z NOTATKĄ
  window.handleWaitlist = async function (e) {
    if (e && e.preventDefault) e.preventDefault();
    const emailInput = document.getElementById('waitlist-email');
    const noteInput = document.getElementById('waitlist-note');
    const btn = document.getElementById('waitlist-btn');

    if (!emailInput) return;
    const email = emailInput.value.trim();
    const note = noteInput ? noteInput.value.trim() : '';
    if (!email) return;

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Zapisywanie...';
    }

    try {
      const titleEl = document.getElementById('mentoring-active-title');
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          note,
          type: titleEl ? titleEl.textContent : 'Mentoring biznesowy',
          month: `${monthsNames[currentMonth]} ${currentYear}`
        })
      });
    } catch (err) {
      // Ignore silent network errors
    }

    const formEl = document.getElementById('waitlist-form');
    const successEl = document.getElementById('waitlist-success');
    if (formEl) formEl.style.display = 'none';
    if (successEl) successEl.style.display = 'block';
  };

  // OTWIERANIE I ZAMYKANIE MODALU
  window.openBookingModal = function (tab) {
    const overlay = document.getElementById('booking-modal-overlay');
    if (!overlay) return;

    if (tab) {
      window.switchBookingTab(tab);
    }
    renderCalendar();

    overlay.classList.add('is-visible');
    isModalOpen = true;

    // Przejście kamery 3D do Hotspot DNA
    if (window.scrollHandler && window.getSnapPos) {
      try {
        const snapDna = window.getSnapPos('science', 'dna');
        window.scrollHandler.scrollTo(snapDna, { direct: true });
      } catch (e) {}
    }

    setTimeout(() => {
      if (window.appStore && window.appStore.state && window.appStore.state.navigation) {
        window.appStore.state.navigation.hotspotDna = true;
      }
    }, 150);
  };

  window.closeBookingModal = function () {
    const overlay = document.getElementById('booking-modal-overlay');
    if (overlay) {
      overlay.classList.remove('is-visible');
    }
    isModalOpen = false;

    if (window.appStore && window.appStore.state && window.appStore.state.navigation) {
      window.appStore.state.navigation.hotspotDna = false;
    }
  };

  function initModalEvents() {
    const overlay = document.getElementById('booking-modal-overlay');
    if (!overlay) return;

    // Kliknięcie w tło overlay (poza taflą szklaną) zamyka modal
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        window.closeBookingModal();
      }
    });

    // Klawisz Escape zamyka modal
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isModalOpen) {
        window.closeBookingModal();
      }
    });

    renderCalendar();
  }

  // PĘTLA SYNCHRONIZACYJNA ZE STANEM 3D (hotspotDna)
  function startSyncLoop() {
    function checkSync() {
      if (window.appStore && window.appStore.state && window.appStore.state.navigation) {
        const hotspotActive = Boolean(window.appStore.state.navigation.hotspotDna);
        const overlay = document.getElementById('booking-modal-overlay');

        if (overlay) {
          if (hotspotActive && !isModalOpen) {
            overlay.classList.add('is-visible');
            isModalOpen = true;
            renderCalendar();
          } else if (!hotspotActive && isModalOpen) {
            overlay.classList.remove('is-visible');
            isModalOpen = false;
          }
        }
      }
      requestAnimationFrame(checkSync);
    }
    requestAnimationFrame(checkSync);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initModalEvents();
      startSyncLoop();
    });
  } else {
    initModalEvents();
    startSyncLoop();
  }
})();
