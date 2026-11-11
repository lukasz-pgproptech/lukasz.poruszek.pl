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
      updatePriceDisplay();
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

  // -------------------------------------------------------------
  // DANE WARSZTATÓW, GRUPY I KODY RABATOWE
  // -------------------------------------------------------------
  const WORKSHOP_BASE_PRICE = 1200;
  let activeCoupon = null;
  let activeGroup = 'december';

  const WORKSHOP_GROUPS = {
    december: {
      name: 'Grupa grudniowa',
      label: 'Grupa grudniowa (start 1.12.2026, 19:00)',
      scheduleTitle: 'Harmonogram cyklu (wtorki 19:00 – 21:00)',
      status: 'Status: Zapisy otwarte',
      sessions: [
        { num: '01', date: '1 grudnia 2026', time: '19:00 – 21:00 (Start cyklu)' },
        { num: '02', date: '8 grudnia 2026', time: '19:00 – 21:00' },
        { num: '03', date: '15 grudnia 2026', time: '19:00 – 21:00' },
        { num: '04', date: '22 grudnia 2026', time: '19:00 – 21:00' },
        { num: '05', date: '29 grudnia 2026', time: '19:00 – 21:00' },
        { num: '06', date: '5 stycznia 2027', time: '19:00 – 21:00 (Finał)' }
      ]
    },
    january: {
      name: 'Grupa styczniowa',
      label: 'Grupa styczniowa (start 5.01.2027, 19:00)',
      scheduleTitle: 'Harmonogram cyklu (wtorki 19:00 – 21:00)',
      status: 'Status: Zapisy otwarte',
      sessions: [
        { num: '01', date: '5 stycznia 2027', time: '19:00 – 21:00 (Start cyklu)' },
        { num: '02', date: '12 stycznia 2027', time: '19:00 – 21:00' },
        { num: '03', date: '19 stycznia 2027', time: '19:00 – 21:00' },
        { num: '04', date: '26 stycznia 2027', time: '19:00 – 21:00' },
        { num: '05', date: '2 lutego 2027', time: '19:00 – 21:00' },
        { num: '06', date: '9 lutego 2027', time: '19:00 – 21:00 (Finał)' }
      ]
    }
  };

  const VALID_COUPONS = {
    'CHORWACJA': { percent: 50, label: '-50% (Rabat partnerski)' },
    'RESICRAFT': { percent: 50, label: '-50% (Rabat partnerski)' },
    '432834145': { percent: 100, label: '-100% (Bezpłatny dostęp)' }
  };

  // PRZEŁĄCZANIE GRUPY WARSZTATOWEJ (GRUDZIEŃ / STYCZEŃ)
  window.switchWorkshopGroup = function (groupId) {
    if (!WORKSHOP_GROUPS[groupId]) return;
    activeGroup = groupId;

    const pillDec = document.getElementById('ws-pill-dec');
    const pillJan = document.getElementById('ws-pill-jan');
    if (pillDec) pillDec.classList.toggle('active', groupId === 'december');
    if (pillJan) pillJan.classList.toggle('active', groupId === 'january');

    const group = WORKSHOP_GROUPS[groupId];
    const scheduleTitle = document.getElementById('ws-schedule-title');
    if (scheduleTitle) scheduleTitle.textContent = group.scheduleTitle;

    const scheduleList = document.getElementById('ws-schedule-list');
    if (scheduleList) {
      scheduleList.innerHTML = group.sessions.map((s, idx) => `
        <div class="schedule-item"${idx === 0 ? ' style="background: rgba(255, 255, 255, 0.07); border-color: rgba(255, 255, 255, 0.18); color: #ffffff;"' : ''}>
          <span class="schedule-date"><span class="schedule-num">${s.num}</span> ${s.date}</span>
          <span class="schedule-time">${s.time}</span>
        </div>
      `).join('');
    }

    const statusTag = document.getElementById('ws-group-status');
    if (statusTag) statusTag.textContent = group.status;

    if (typeof updateStep2Summary === 'function' && currentStep === 2) {
      updateStep2Summary();
    }
  };

  // ROZWIJANIE POLA KODU RABATOWEGO
  window.toggleCouponBox = function () {
    const box = document.getElementById('couponBox');
    const btnText = document.getElementById('couponToggleText');
    if (!box) return;
    const isOpen = box.classList.toggle('is-open');
    if (btnText) {
      btnText.textContent = isOpen ? '✕ Zamknij kod rabatowy' : '+ Masz kod rabatowy?';
    }
    if (isOpen) {
      const input = document.getElementById('ws-coupon-input');
      if (input) input.focus();
    }
  };

  let activePaymentMode = 'bank_transfer';

  // Pobierz aktywny tryb płatności z serwera (Paynow vs Przelew bankowy)
  try {
    fetch('/api/payment-config')
      .then(res => res.json())
      .then(cfg => {
        if (cfg && cfg.mode) {
          activePaymentMode = cfg.mode;
          updatePriceDisplay();
        }
      })
      .catch(() => {});
  } catch (e) {}

  // Pomocnicza funkcja kopiowania do schowka
  window.copyTransferText = function (btn, text) {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        const orig = btn.textContent;
        btn.textContent = '✓ Skopiowano';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = orig;
          btn.classList.remove('copied');
        }, 2000);
      }).catch(() => fallbackCopy(btn, text));
    } else {
      fallbackCopy(btn, text);
    }
  };

  function fallbackCopy(btn, text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    const orig = btn.textContent;
    btn.textContent = '✓ Skopiowano';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = orig;
      btn.classList.remove('copied');
    }, 2000);
  }

  // PRZELICZANIE KWOT I AKTUALIZACJA PODSUMOWANIA
  function updatePriceDisplay() {
    let discountAmount = 0;
    let finalPrice = WORKSHOP_BASE_PRICE;

    if (activeCoupon) {
      discountAmount = Math.round(WORKSHOP_BASE_PRICE * (activeCoupon.percent / 100));
      finalPrice = Math.max(0, WORKSHOP_BASE_PRICE - discountAmount);
    }

    const discountRow = document.getElementById('ws-discount-row');
    const discountLabel = document.getElementById('ws-discount-label');
    const discountAmountEl = document.getElementById('ws-discount-amount');
    const totalAmountEl = document.getElementById('ws-total-amount');
    const submitBtnText = document.getElementById('ws-submit-btn-text');
    const paynowBadge = document.getElementById('ws-paynow-badge');

    if (discountRow) {
      discountRow.classList.toggle('visible', Boolean(activeCoupon));
    }
    if (discountLabel && activeCoupon) {
      discountLabel.textContent = `Rabat (${activeCoupon.code}):`;
    }
    if (discountAmountEl && activeCoupon) {
      discountAmountEl.textContent = `-${discountAmount.toLocaleString('pl-PL')} PLN (${activeCoupon.percent}%)`;
    }
    if (totalAmountEl) {
      totalAmountEl.textContent = `${finalPrice.toLocaleString('pl-PL')} PLN`;
    }

    if (submitBtnText) {
      if (finalPrice === 0) {
        submitBtnText.textContent = 'Zatwierdź bezpłatną rezerwację (0 PLN)';
      } else {
        submitBtnText.textContent = `Zarezerwuj i przejdź do płatności (${finalPrice.toLocaleString('pl-PL')} PLN)`;
      }
    }

    if (paynowBadge) {
      if (finalPrice === 0) {
        paynowBadge.style.display = 'none';
      } else {
        paynowBadge.style.display = 'flex';
        const badgeSpan = paynowBadge.querySelector('span:last-child');
        if (badgeSpan) {
          if (activePaymentMode === 'paynow') {
            badgeSpan.textContent = 'Bezpieczna płatność online przez Paynow (BLIK, szybki przelew, karta)';
          } else {
            badgeSpan.textContent = 'Płatność przelewem / kodem QR dla aplikacji bankowych (BLIK / mBank)';
          }
        }
      }
    }

    if (typeof updateStep2Summary === 'function' && currentStep === 2) {
      updateStep2Summary();
    }
  }

  // ZASTOSOWANIE KODU RABATOWEGO (BEZPIECZNA WALIDACJA PO STRONIE SERWERA)
  window.applyCoupon = async function () {
    const input = document.getElementById('ws-coupon-input');
    const feedback = document.getElementById('ws-coupon-feedback');
    const applyBtn = document.getElementById('ws-coupon-btn');
    if (!input) return;
    const code = input.value.trim().toUpperCase();

    if (!code) {
      activeCoupon = null;
      if (feedback) {
        feedback.className = 'coupon-feedback';
        feedback.textContent = '';
      }
      updatePriceDisplay();
      return;
    }

    if (feedback) {
      feedback.className = 'coupon-feedback';
      feedback.textContent = 'Sprawdzam kod...';
    }
    if (applyBtn) applyBtn.disabled = true;

    try {
      const res = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();

      if (res.ok && data.valid) {
        activeCoupon = {
          code: data.code,
          percent: data.discountPercent,
          label: `-${data.discountPercent}% (${data.discountPercent === 100 ? 'Bezpłatny dostęp' : 'Rabat partnerski'})`
        };
        if (feedback) {
          feedback.className = 'coupon-feedback success';
          feedback.innerHTML = `✓ Naliczono zniżkę: <strong>${activeCoupon.label}</strong>`;
        }
      } else {
        activeCoupon = null;
        if (feedback) {
          feedback.className = 'coupon-feedback error';
          feedback.textContent = `✕ ${data.error || 'Nieprawidłowy kod rabatowy.'}`;
        }
      }
    } catch (err) {
      console.error('Błąd walidacji kodu rabatowego:', err);
      activeCoupon = null;
      if (feedback) {
        feedback.className = 'coupon-feedback error';
        feedback.textContent = '✕ Błąd połączenia przy sprawdzaniu kodu.';
      }
    } finally {
      if (applyBtn) applyBtn.disabled = false;
      updatePriceDisplay();
    }
  };

  // -------------------------------------------------------------
  // ZARZĄDZANIE KROKAMI: KROK 1 (SZYBKI START) -> KROK 2 (FAKTURA & PŁATNOŚĆ)
  // -------------------------------------------------------------
  let currentStep = 1;
  let currentReservationEmail = '';
  let step2BuyerType = 'individual'; // 'individual' | 'company'
  let verifiedCompanyData = null;
  let nipDebounceTimer = null;

  window.handleStep1Submit = function (e) {
    if (e && e.preventDefault) e.preventDefault();
    const emailInput = document.getElementById('ws-email');
    if (!emailInput) return;
    const email = emailInput.value.trim();
    if (!email || !email.includes('@')) {
      emailInput.focus();
      return;
    }

    currentReservationEmail = email;
    goToStep2();
  };

  // Kompatybilność wsteczna
  window.handleWorkshopSubmit = function (e) {
    window.handleStep1Submit(e);
  };

  window.goToStep2 = function () {
    currentStep = 2;
    const emailInput = document.getElementById('ws-email');
    if (emailInput && emailInput.value && !currentReservationEmail) {
      currentReservationEmail = emailInput.value.trim();
    }
    const step1El = document.getElementById('workshop-step-1');
    const step2El = document.getElementById('workshop-step-2');
    const container = document.getElementById('workshop-view') || document.querySelector('.workshop-container');
    const selector = document.querySelector('.event-type-selector');
    const groupHeader = document.querySelector('.workshop-group-header');

    if (selector) selector.style.display = 'none';
    if (groupHeader) groupHeader.style.display = 'none';

    if (step1El) step1El.style.display = 'none';
    if (step2El) step2El.style.display = 'flex';

    updateStep2Summary();
    if (container) container.scrollTop = 0;
  };

  window.goToStep1 = function () {
    currentStep = 1;
    const step1El = document.getElementById('workshop-step-1');
    const step2El = document.getElementById('workshop-step-2');
    const container = document.getElementById('workshop-view') || document.querySelector('.workshop-container');
    const selector = document.querySelector('.event-type-selector');
    const groupHeader = document.querySelector('.workshop-group-header');

    if (selector) selector.style.display = '';
    if (groupHeader) groupHeader.style.display = '';

    if (step2El) step2El.style.display = 'none';
    if (step1El) step1El.style.display = 'grid';

    if (container) container.scrollTop = 0;
  };

  function updateStep2Summary() {
    const selectedGroupData = WORKSHOP_GROUPS[activeGroup] || WORKSHOP_GROUPS.december;
    let discountAmount = 0;
    let finalPrice = WORKSHOP_BASE_PRICE;

    if (activeCoupon) {
      discountAmount = Math.round(WORKSHOP_BASE_PRICE * (activeCoupon.percent / 100));
      finalPrice = Math.max(0, WORKSHOP_BASE_PRICE - discountAmount);
    }

    const netPrice = (finalPrice / 1.23).toFixed(2);
    const vatPrice = (finalPrice - parseFloat(netPrice)).toFixed(2);

    const summaryGroup = document.getElementById('ws2-summary-group');
    const summaryEmail = document.getElementById('ws2-summary-email');
    const finBase = document.getElementById('ws2-fin-base');
    const finDiscountRow = document.getElementById('ws2-fin-discount-row');
    const finDiscountLabel = document.getElementById('ws2-fin-discount-label');
    const finDiscountVal = document.getElementById('ws2-fin-discount-val');
    const finNet = document.getElementById('ws2-fin-net');
    const finVat = document.getElementById('ws2-fin-vat');
    const finTotal = document.getElementById('ws2-fin-total');
    const submitBtnText = document.getElementById('ws2-submit-btn-text');

    if (summaryGroup) {
      const firstDate = (selectedGroupData.sessions && selectedGroupData.sessions[0]) ? selectedGroupData.sessions[0].date : '1 grudnia 2026';
      summaryGroup.textContent = `${selectedGroupData.name} (start ${firstDate}, 19:00)`;
    }
    if (summaryEmail) summaryEmail.textContent = currentReservationEmail || '—';
    if (finBase) finBase.textContent = `${WORKSHOP_BASE_PRICE.toLocaleString('pl-PL')},00 PLN`;

    if (finDiscountRow) {
      finDiscountRow.style.display = activeCoupon ? 'flex' : 'none';
      if (activeCoupon && finDiscountLabel) finDiscountLabel.textContent = `Rabat (${activeCoupon.code}):`;
      if (activeCoupon && finDiscountVal) finDiscountVal.textContent = `-${discountAmount.toLocaleString('pl-PL')},00 PLN (${activeCoupon.percent}%)`;
    }

    if (finNet) finNet.textContent = `${parseFloat(netPrice).toLocaleString('pl-PL', { minimumFractionDigits: 2 })} PLN`;
    if (finVat) finVat.textContent = `${parseFloat(vatPrice).toLocaleString('pl-PL', { minimumFractionDigits: 2 })} PLN`;
    if (finTotal) finTotal.textContent = `${finalPrice.toLocaleString('pl-PL')},00 PLN`;

    if (submitBtnText) {
      if (finalPrice === 0) {
        submitBtnText.textContent = 'Zatwierdź bezpłatną rezerwację (0 PLN)';
      } else if (activePaymentMode === 'paynow') {
        submitBtnText.textContent = `Zatwierdź i przejdź do Paynow (${finalPrice.toLocaleString('pl-PL')} PLN)`;
      } else {
        submitBtnText.textContent = `Zatwierdź dane i przejdź do płatności (${finalPrice.toLocaleString('pl-PL')} PLN)`;
      }
    }
  }

  // PRZEŁĄCZANIE OSOBA PRYWATNA / FIRMA W KROKU 2 (JEDNOLITA SIATKA)
  window.setStep2BuyerType = function (type) {
    step2BuyerType = type;
    const btnInd = document.getElementById('ws2-type-ind');
    const btnComp = document.getElementById('ws2-type-comp');
    const nipInput = document.getElementById('ws2-nip');
    const nipHint = document.getElementById('ws2-nip-hint');
    const labelNip = document.getElementById('ws2-label-nip');
    const labelName = document.getElementById('ws2-label-name');
    const inputName = document.getElementById('ws2-name');
    const labelStreet = document.getElementById('ws2-label-street');
    const card = document.getElementById('ws2-company-card');

    if (btnInd) btnInd.classList.toggle('active', type === 'individual');
    if (btnComp) btnComp.classList.toggle('active', type === 'company');

    if (type === 'individual') {
      if (nipInput) {
        nipInput.disabled = true;
        nipInput.value = '';
        nipInput.placeholder = 'Nie dotyczy (osoba prywatna)';
      }
      if (nipHint) {
        nipHint.textContent = 'Nie dotyczy';
        nipHint.style.color = 'rgba(255,255,255,0.4)';
      }
      if (labelName) labelName.textContent = 'Imię i nazwisko';
      if (inputName) inputName.placeholder = 'np. Jan Kowalski';
      if (labelStreet) labelStreet.textContent = 'Ulica i numer zamieszkania';
      if (card) card.style.display = 'none';
    } else {
      if (nipInput) {
        nipInput.disabled = false;
        nipInput.placeholder = 'Wpisz 10 cyfr NIP firmy (pobierze dane z MF)...';
        if (!nipInput.value && verifiedCompanyData && verifiedCompanyData.nip) {
          nipInput.value = verifiedCompanyData.nip;
        }
      }
      if (nipHint) {
        nipHint.textContent = 'Wymagany do faktury';
        nipHint.style.color = '#4ade80';
      }
      if (labelName) labelName.textContent = 'Pełna nazwa firmy';
      if (inputName) inputName.placeholder = 'np. Acme Sp. z o.o.';
      if (labelStreet) labelStreet.textContent = 'Ulica i numer siedziby';
      if (verifiedCompanyData && card) {
        card.style.display = 'flex';
      }
    }
  };

  // OBSŁUGA NIP W KROKU 2 (BIAŁA LISTA MF)
  window.handleStep2NipInput = function (rawVal) {
    const cleanNip = String(rawVal || '').replace(/\D/g, '');
    const spinner = document.getElementById('ws2-nip-spinner');
    const card = document.getElementById('ws2-company-card');

    clearTimeout(nipDebounceTimer);

    if (cleanNip.length < 10) {
      if (spinner) spinner.style.display = 'none';
      if (card) card.style.display = 'none';
      verifiedCompanyData = null;
      return;
    }

    if (cleanNip.length === 10) {
      if (spinner) {
        spinner.style.display = 'inline';
        spinner.textContent = 'Szukam w MF...';
      }

      nipDebounceTimer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/nip-lookup?nip=${encodeURIComponent(cleanNip)}`);
          const data = await res.json();
          if (spinner) spinner.style.display = 'none';

          if (res.ok && (data.success || data.found) && data.name) {
            verifiedCompanyData = data;
            if (card) {
              card.style.display = 'flex';
              const nameEl = document.getElementById('ws2-company-name-val');
              const addrEl = document.getElementById('ws2-company-addr-val');
              const vatEl = document.getElementById('ws2-company-vat-badge');

              if (nameEl) nameEl.textContent = data.name;
              if (addrEl) addrEl.textContent = `${data.street ? data.street + ', ' : ''}${data.postalCode} ${data.city}`;
              if (vatEl) vatEl.textContent = `✓ ${data.statusVat || 'Czynny podatnik VAT'}`;
            }

            // Auto-uzupełnienie pól formularza
            const nameInput = document.getElementById('ws2-name');
            const streetInput = document.getElementById('ws2-street');
            const zipInput = document.getElementById('ws2-zip');
            const cityInput = document.getElementById('ws2-city');

            if (nameInput) nameInput.value = data.name;
            if (streetInput) streetInput.value = data.street || '';
            if (zipInput) zipInput.value = data.postalCode || '';
            if (cityInput) cityInput.value = data.city || '';
          } else {
            verifiedCompanyData = null;
            if (card) card.style.display = 'none';
          }
        } catch (err) {
          console.error('Błąd zapytania NIP:', err);
          if (spinner) spinner.style.display = 'none';
          verifiedCompanyData = null;
          if (card) card.style.display = 'none';
        }
      }, 350);
    }
  };

  window.resetStep2CompanyData = function () {
    verifiedCompanyData = null;
    const nipInput = document.getElementById('ws2-nip');
    const card = document.getElementById('ws2-company-card');
    if (nipInput) {
      nipInput.value = '';
      nipInput.focus();
    }
    if (card) card.style.display = 'none';
  };

  // OBSŁUGA WYSYŁKI FORMULARZA FAKTURY I PŁATNOŚCI (KROK 2)
  window.submitStep2InvoiceForm = async function (e) {
    if (e && e.preventDefault) e.preventDefault();

    const nameInput = document.getElementById('ws2-name');
    const streetInput = document.getElementById('ws2-street');
    const zipInput = document.getElementById('ws2-zip');
    const cityInput = document.getElementById('ws2-city');
    const nipInput = document.getElementById('ws2-nip');
    const btn = document.getElementById('ws2-submit-btn');
    const btnText = document.getElementById('ws2-submit-btn-text');

    if (!nameInput || !streetInput || !zipInput || !cityInput) return;

    const name = nameInput.value.trim();
    const street = streetInput.value.trim();
    const zip = zipInput.value.trim();
    const city = cityInput.value.trim();
    const nip = (step2BuyerType === 'company' && nipInput) ? nipInput.value.trim().replace(/\D/g, '') : '';

    if (!name) { nameInput.focus(); return; }
    if (step2BuyerType === 'company' && (!nip || nip.length !== 10)) {
      if (nipInput) nipInput.focus();
      alert('Proszę podać poprawny, 10-cyfrowy NIP firmy.');
      return;
    }
    if (!street) { streetInput.focus(); return; }
    if (!zip) { zipInput.focus(); return; }
    if (!city) { cityInput.focus(); return; }

    if (btn) btn.disabled = true;
    if (btnText) btnText.textContent = 'Rezerwacja w toku...';

    const selectedGroupData = WORKSHOP_GROUPS[activeGroup] || WORKSHOP_GROUPS.december;

    const finalEmail = currentReservationEmail || (document.getElementById('ws-email') ? document.getElementById('ws-email').value.trim() : '');
    if (!finalEmail) {
      alert('Brak adresu e-mail. Wróć do kroku 1 i podaj adres e-mail.');
      if (btn) btn.disabled = false;
      if (btnText) btnText.textContent = 'Zatwierdź dane i przejdź do płatności';
      return;
    }

    try {
      const res = await fetch('/api/reserve-workshop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: finalEmail,
          phone: '',
          group: selectedGroupData.label,
          groupId: activeGroup,
          coupon: activeCoupon ? activeCoupon.code : null,
          buyerType: step2BuyerType,
          invoiceNip: nip,
          invoiceCompanyName: (step2BuyerType === 'company') ? name : '',
          invoiceStreet: street,
          invoicePostalCode: zip,
          invoiceCity: city
        })
      });

      const data = await res.json();

      if (res.ok) {
        // SCENARIUSZ 1: Przekierowanie do bramki Paynow (docelowo)
        if (data.redirectUrl) {
          if (btnText) btnText.textContent = 'Przekierowanie do Paynow...';
          window.location.href = data.redirectUrl;
          return;
        }

        // SCENARIUSZ 2: Wyświetlenie Karty Płatności w prawej kolumnie Kroku 2
        const formView = document.getElementById('ws2-invoice-form-view');
        const paymentBox = document.getElementById('ws2-payment-box');
        if (formView) formView.style.display = 'none';
        if (paymentBox) {
          paymentBox.style.display = 'block';

          if (data.isZeroPayment) {
            paymentBox.innerHTML = `
              <div class="reservation-success-box" style="display: flex;">
                <div class="success-icon">✓</div>
                <h4 class="success-title">Rezerwacja bezpłatna potwierdzona</h4>
                <p class="success-desc">
                  Dziękujemy, <strong>${name}</strong>!<br>
                  Twoje miejsce w grupie <strong>${selectedGroupData.name}</strong> zostało pomyślnie zarezerwowane ze 100% rabatem specjalnym.<br>
                  Potwierdzenie oraz linki do spotkań zostały wysłane na <strong>${currentReservationEmail}</strong>.
                  ${data.invoiceUrl ? `
                    <div style="margin-top: 14px;">
                      <a href="${data.invoiceUrl}" target="_blank" class="invoice-download-btn">
                        📄 Pobierz e-Fakturę KSeF (${data.invoiceNumber || 'Faktura VAT'})
                      </a>
                    </div>
                  ` : ''}
                </p>
              </div>
            `;
          } else if (data.transfer) {
            let qrHtml = '';
            if (window.qrcode && data.transfer.qrPayload) {
              try {
                const qr = window.qrcode(0, 'M');
                qr.addData(data.transfer.qrPayload);
                qr.make();
                const svgTag = qr.createSvgTag({ cellSize: 3, margin: 2 });
                qrHtml = `
                  <div class="transfer-qr-section">
                    <div class="transfer-qr-box">
                      ${svgTag}
                    </div>
                    <div class="transfer-qr-info">
                      <div class="transfer-qr-title">📱 Szybki przelew w aplikacji banku</div>
                      <div class="transfer-qr-desc">
                        Otwórz aplikację swojego banku (mBank, PKO IKO, ING, Santander itp.) i wybierz <strong>„Skanuj kod QR”</strong>. Dane zostaną uzupełnione automatycznie.
                      </div>
                    </div>
                  </div>
                `;
              } catch (qrErr) {
                console.warn('QR error:', qrErr);
              }
            }

            paymentBox.innerHTML = `
              <div class="transfer-status-pill">✓ Miejsce wstępnie zablokowane na 24h</div>
              <div style="margin-top: 6px; font-size: 12.5px; color: #ffffff; line-height: 1.45;">
                Dziękujemy, <strong>${name}</strong>!<br>
                Rezerwacja w grupie <strong>${selectedGroupData.name}</strong> została zarejestrowana (nr <strong>${data.invoiceNumber}</strong>).
              </div>

              <div class="bank-transfer-card">
                <div class="transfer-amount-row">
                  <span class="transfer-amount-label">Kwota do zapłaty:</span>
                  <span class="transfer-amount-val">${data.transfer.amountFormatted}</span>
                </div>

                <div class="transfer-fields-list">
                  <div class="transfer-field-item">
                    <span class="transfer-field-label">Numer rachunku bankowego:</span>
                    <div class="transfer-field-val-row">
                      <span class="transfer-field-val">${data.transfer.accountFormatted}</span>
                      <button type="button" class="btn-copy-transfer" onclick="copyTransferText(this, '${data.transfer.accountRaw}')">Kopiuj</button>
                    </div>
                  </div>

                  <div class="transfer-field-item">
                    <span class="transfer-field-label">Odbiorca:</span>
                    <div class="transfer-field-val-row">
                      <span class="transfer-field-val" style="font-family: inherit; font-size: 11px;">${data.transfer.recipient}</span>
                      <button type="button" class="btn-copy-transfer" onclick="copyTransferText(this, '${data.transfer.recipient}')">Kopiuj</button>
                    </div>
                  </div>

                  <div class="transfer-field-item">
                    <span class="transfer-field-label">Tytuł przelewu:</span>
                    <div class="transfer-field-val-row">
                      <span class="transfer-field-val">${data.transfer.title}</span>
                      <button type="button" class="btn-copy-transfer" onclick="copyTransferText(this, '${data.transfer.title}')">Kopiuj</button>
                    </div>
                  </div>
                </div>

                ${qrHtml}
              </div>

              <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 6px;">
                ${data.invoiceUrl ? `
                  <a href="${data.invoiceUrl}" target="_blank" class="invoice-download-btn">
                    📄 Pobierz Fakturę Proforma (${data.invoiceNumber || 'Proforma'})
                  </a>
                ` : ''}
                <div style="font-size: 10.5px; color: rgba(255, 255, 255, 0.45); text-align: center; margin-top: 2px;">
                  Potwierdzenie rezerwacji zostało wysłane na <strong>${currentReservationEmail}</strong>.<br>
                  Po zaksięgowaniu wpłaty dokument zostanie przekształcony w e-Fakturę VAT KSeF.
                </div>
              </div>
            `;
          }
        }
      } else {
        alert('Wystąpił problem: ' + (data.error || 'Spróbuj ponownie.'));
        if (btn) btn.disabled = false;
        updateStep2Summary();
      }
    } catch (err) {
      console.error('Błąd rezerwacji warsztatów:', err);
      alert('Wystąpił błąd połączenia. Spróbuj ponownie.');
      if (btn) btn.disabled = false;
      updateStep2Summary();
    }
  };

  // Kompatybilność wsteczna dla starych metod
  window.setBuyerType = window.setStep2BuyerType;
  window.handleNipInput = window.handleStep2NipInput;

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
  let originSceneSnap = null;

  window.openBookingModal = function (tab) {
    const overlay = document.getElementById('booking-modal-overlay');
    if (!overlay) return;

    if (window.scrollHandler && window.getSnapPos) {
      try {
        const snapData = window.getSnapPos('science', 'data');
        const curPos = (typeof window.scrollHandler.getScrollPosition === 'function')
          ? window.scrollHandler.getScrollPosition()
          : (window.scrollHandler.position !== undefined ? window.scrollHandler.position : (window.appStore && window.appStore.state && window.appStore.state.scroll ? window.appStore.state.scroll.position : 0));
        if (Math.abs(curPos - snapData) < 480 || window.isSection2Active || window.isDetailViewOpen) {
          originSceneSnap = snapData;
        } else {
          originSceneSnap = null;
        }
      } catch (e) {
        originSceneSnap = null;
      }
    }

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

    if (originSceneSnap !== null && window.scrollHandler) {
      const targetSnap = originSceneSnap;
      originSceneSnap = null;
      setTimeout(() => {
        try {
          window.scrollHandler.scrollTo(targetSnap, { direct: true });
        } catch (e) {}
      }, 200);
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
    updatePriceDisplay();

    // Sprawdzenie powrotu z bramki płatności Paynow (?payment=success)
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('payment') === 'success') {
        const orderId = params.get('order') || '';
        setTimeout(() => {
          window.openBookingModal('warsztaty');
          const formEl = document.getElementById('workshop-form');
          const successBox = document.getElementById('ws-success-box');
          const successDesc = document.getElementById('ws-success-desc');
          if (formEl) formEl.style.display = 'none';
          if (successBox) successBox.style.display = 'flex';
          if (successDesc) {
            successDesc.innerHTML = `
              Płatność przez Paynow zakończona pomyślnie!<br>
              Twoje miejsce w warsztatach zostało opłacone i potwierdzone${orderId ? ` (Zamówienie: ${orderId})` : ''}.<br>
              Szczegóły oraz harmonogram spotkań przesłaliśmy na Twój adres e-mail.
            `;
          }
        }, 400);
      }
    } catch (e) {}
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
