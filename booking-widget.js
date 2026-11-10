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
      } else if (activePaymentMode === 'paynow') {
        submitBtnText.textContent = `Przejdź do płatności Paynow (${finalPrice.toLocaleString('pl-PL')} PLN)`;
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
  // DANE NABYWCY I FAKTURA VAT (KSeF)
  // -------------------------------------------------------------
  let buyerType = 'individual'; // 'individual' | 'company'
  let verifiedCompanyData = null;
  let nipDebounceTimer = null;

  window.setBuyerType = function (type) {
    buyerType = type;
    const btnInd = document.getElementById('btn-buyer-ind');
    const btnComp = document.getElementById('btn-buyer-comp');
    const fieldsInd = document.getElementById('fieldsIndividual');
    const fieldsComp = document.getElementById('fieldsCompany');

    if (btnInd) btnInd.classList.toggle('active', type === 'individual');
    if (btnComp) btnComp.classList.toggle('active', type === 'company');

    if (fieldsInd) fieldsInd.style.display = (type === 'individual') ? 'flex' : 'none';
    if (fieldsComp) fieldsComp.style.display = (type === 'company') ? 'flex' : 'none';
  };

  window.handleNipInput = function (rawVal) {
    const cleanNip = String(rawVal || '').replace(/\D/g, '');
    const spinner = document.getElementById('nipSpinner');
    const card = document.getElementById('companyVerifiedCard');
    const manualFields = document.getElementById('companyManualFields');

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
              const nameEl = document.getElementById('companyVerifiedName');
              const addrEl = document.getElementById('companyVerifiedAddr');
              const vatEl = document.getElementById('companyVatBadge');

              if (nameEl) nameEl.textContent = data.name;
              if (addrEl) addrEl.textContent = `${data.street ? data.street + ', ' : ''}${data.postalCode} ${data.city}`;
              if (vatEl) vatEl.textContent = `✓ ${data.statusVat || 'Czynny podatnik VAT'}`;
            }
            if (manualFields) manualFields.style.display = 'none';
          } else {
            // Brak w MF lub błąd – umożliwienie wpisania ręcznego
            verifiedCompanyData = null;
            if (card) card.style.display = 'none';
            if (manualFields) manualFields.style.display = 'flex';
          }
        } catch (err) {
          console.error('Błąd zapytania NIP:', err);
          if (spinner) spinner.style.display = 'none';
          verifiedCompanyData = null;
          if (card) card.style.display = 'none';
          if (manualFields) manualFields.style.display = 'flex';
        }
      }, 350);
    }
  };

  window.toggleManualCompanyEdit = function () {
    const manualFields = document.getElementById('companyManualFields');
    if (!manualFields) return;
    const isShown = manualFields.style.display === 'flex';
    manualFields.style.display = isShown ? 'none' : 'flex';

    if (!isShown && verifiedCompanyData) {
      const nameInput = document.getElementById('ws-company-name');
      const streetInput = document.getElementById('ws-company-street');
      const zipInput = document.getElementById('ws-company-zip');
      const cityInput = document.getElementById('ws-company-city');
      if (nameInput) nameInput.value = verifiedCompanyData.name || '';
      if (streetInput) streetInput.value = verifiedCompanyData.street || '';
      if (zipInput) zipInput.value = verifiedCompanyData.postalCode || '';
      if (cityInput) cityInput.value = verifiedCompanyData.city || '';
    }
  };

  // OBSŁUGA REZERWACJI I PŁATNOŚCI PAYNOW
  window.handleWorkshopSubmit = async function (e) {
    if (e && e.preventDefault) e.preventDefault();
    const btn = document.getElementById('ws-submit-btn');
    const btnText = document.getElementById('ws-submit-btn-text');
    const nameEl = document.getElementById('ws-name');
    const emailEl = document.getElementById('ws-email');
    const phoneEl = document.getElementById('ws-phone');

    if (!nameEl || !emailEl) return;
    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const phone = phoneEl ? phoneEl.value.trim() : '';

    if (!name || !email) return;

    // Pobranie danych do faktury VAT
    let invoiceStreet = '';
    let invoicePostalCode = '';
    let invoiceCity = '';
    let invoiceNip = '';
    let invoiceCompanyName = '';

    if (buyerType === 'individual') {
      const streetEl = document.getElementById('ws-buyer-street');
      const zipEl = document.getElementById('ws-buyer-zip');
      const cityEl = document.getElementById('ws-buyer-city');
      invoiceStreet = streetEl ? streetEl.value.trim() : '';
      invoicePostalCode = zipEl ? zipEl.value.trim() : '';
      invoiceCity = cityEl ? cityEl.value.trim() : '';
    } else {
      const nipEl = document.getElementById('ws-nip');
      const nameElManual = document.getElementById('ws-company-name');
      const streetElManual = document.getElementById('ws-company-street');
      const zipElManual = document.getElementById('ws-company-zip');
      const cityElManual = document.getElementById('ws-company-city');

      invoiceNip = nipEl ? nipEl.value.trim().replace(/\D/g, '') : '';
      if (verifiedCompanyData) {
        invoiceCompanyName = verifiedCompanyData.name || '';
        invoiceStreet = verifiedCompanyData.street || '';
        invoicePostalCode = verifiedCompanyData.postalCode || '';
        invoiceCity = verifiedCompanyData.city || '';
      }
      if (nameElManual && nameElManual.value.trim()) invoiceCompanyName = nameElManual.value.trim();
      if (streetElManual && streetElManual.value.trim()) invoiceStreet = streetElManual.value.trim();
      if (zipElManual && zipElManual.value.trim()) invoicePostalCode = zipElManual.value.trim();
      if (cityElManual && cityElManual.value.trim()) invoiceCity = cityElManual.value.trim();
    }

    if (btn) btn.disabled = true;
    if (btnText) btnText.textContent = 'Przetwarzanie...';

    const selectedGroupData = WORKSHOP_GROUPS[activeGroup] || WORKSHOP_GROUPS.december;

    try {
      const res = await fetch('/api/reserve-workshop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          group: selectedGroupData.label,
          groupId: activeGroup,
          coupon: activeCoupon ? activeCoupon.code : null,
          buyerType,
          invoiceNip,
          invoiceCompanyName,
          invoiceStreet,
          invoicePostalCode,
          invoiceCity
        })
      });

      const data = await res.json();

      if (res.ok) {
        // SCENARIUSZ 1: Przekierowanie do bramki płatności Paynow
        if (data.redirectUrl) {
          if (btnText) btnText.textContent = 'Przekierowanie do Paynow...';
          window.location.href = data.redirectUrl;
          return;
        }

        // SCENARIUSZ 2: Rezerwacja ze 100% rabatem (kwota 0 PLN) lub potwierdzenie
        const formEl = document.getElementById('workshop-form');
        const successBox = document.getElementById('ws-success-box');
        const successDesc = document.getElementById('ws-success-desc');
        if (formEl) formEl.style.display = 'none';
        if (successBox) successBox.style.display = 'flex';

        if (successDesc) {
          if (data.isZeroPayment) {
            let invoiceHtml = '';
            if (data.invoiceUrl) {
              invoiceHtml = `
                <div style="margin-top: 14px;">
                  <a href="${data.invoiceUrl}" target="_blank" class="invoice-download-btn">
                    📄 Pobierz e-Fakturę KSeF (${data.invoiceNumber || 'Faktura VAT'})
                  </a>
                  <div style="font-size: 10px; color: rgba(255,255,255,0.45); margin-top: 5px;">
                    Nr KSeF: <code>${data.ksefNumber || 'Zarejestrowano w KSeF MF'}</code>
                  </div>
                </div>
              `;
            }

            successDesc.innerHTML = `
              Dziękujemy, <strong>${name}</strong>!<br>
              Twoje miejsce w grupie <strong>${selectedGroupData.name}</strong> zostało pomyślnie zarezerwowane ze 100% rabatem specjalnym.<br>
              Potwierdzenie oraz linki do spotkań zostały wysłane na <strong>${email}</strong>.
              ${invoiceHtml}
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
                        Otwórz aplikację swojego banku (mBank, PKO IKO, ING, Santander itp.) i wybierz <strong>„Skanuj kod QR”</strong>. Dane przelewu zostaną uzupełnione automatycznie.
                      </div>
                    </div>
                  </div>
                `;
              } catch (qrErr) {
                console.warn('QR generation error:', qrErr);
              }
            }

            successDesc.innerHTML = `
              <div class="transfer-status-pill">✓ Miejsce wstępnie zablokowane na 24h</div>
              <div style="margin-top: 6px; font-size: 12.5px; color: #ffffff; line-height: 1.45;">
                Dziękujemy, <strong>${name}</strong>!<br>
                Rezerwacja w grupie <strong>${selectedGroupData.name}</strong> została zarejestrowana.
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
                  Potwierdzenie rezerwacji zostało wysłane na <strong>${email}</strong>.<br>
                  Po zaksięgowaniu wpłaty dokument zostanie przekształcony w e-Fakturę VAT KSeF.
                </div>
              </div>
            `;
          } else {
            successDesc.innerHTML = `
              Dziękujemy, <strong>${name}</strong>!<br>
              Szczegóły warsztatów (<strong>${selectedGroupData.name}</strong>) zostały wysłane na adres <strong>${email}</strong>.
            `;
          }
        }
      } else {
        alert('Wystąpił problem: ' + (data.error || 'Spróbuj ponownie.'));
        if (btn) btn.disabled = false;
        updatePriceDisplay();
      }
    } catch (err) {
      console.error('Błąd rezerwacji warsztatów:', err);
      const formEl = document.getElementById('workshop-form');
      const successBox = document.getElementById('ws-success-box');
      const successDesc = document.getElementById('ws-success-desc');
      if (formEl) formEl.style.display = 'none';
      if (successBox) successBox.style.display = 'flex';
      if (successDesc) {
        successDesc.innerHTML = `
          Dziękujemy, <strong>${name}</strong>!<br>
          Twoje zgłoszenie do <strong>${selectedGroupData.name}</strong> zostało zarejestrowane.<br>
          Szczegóły zostaną przesłane na adres <strong>${email}</strong>.
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
