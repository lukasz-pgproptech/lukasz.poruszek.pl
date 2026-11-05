/**
 * PRODUCTS INTERACTIVE VIEW CONTROLLER (Section 2 - "data")
 * Manages 3-product interactive tabs and right-hand glass details & booking widget.
 */

(function () {
  'use strict';

  const PRODUCTS_DATA = {
    workshops: {
      id: 'workshops',
      kicker: 'CYKL WARSZTATOWY • ONLINE',
      title: 'ORKIESTRACJA SYSTEMÓW AI',
      badge: '1200 ZŁ • 6 TYGODNI (6x 2H) • KAMERALNA GRUPA',
      description:
        'Kompleksowy proces wdrożeniowy: od precyzyjnego promptowania na czacie webowym, przez pracę agentową w IDE, po tworzenie własnych wieloagentowych systemów i integrację serwerów MCP/API.',
      bullets: [
        'W cenie: spotkania na żywo raz w tygodniu, nadzór nad zadaniami domowymi, pokoje wymiany wiedzy oraz konsultacje 1:1 w razie trudniejszych zagadnień.',
        'Wymaganie: subskrypcja Gemini Pro lub Ultra.'
      ],
      ctaText: 'ZAPISZ SIĘ NA WARSZTATY',
      ctaNote: 'Dostępne kody rabatowe obniżające cenę do 0 zł',
      modalTitle: 'Zapisz się na warsztaty AI',
      modalBody:
        'Cykl 6-tygodniowy (6 spotkań po 2h). Kameralna grupa (8–15 osób). Wybierz najbliższy termin edycji i dołącz do grupy praktyków orkiestracji AI.',
      modalActionUrl: '/mockup-warsztaty.html'
    },
    business: {
      id: 'business',
      kicker: 'SESJA STRATEGICZNA 1:1',
      title: 'DIAGNOZA BIZNESOWA I WALIDACJA',
      badge: '400 ZŁ • SESJA 90 MINUT • SPOTKANIE ONLINE',
      description:
        'Doraźna diagnoza i usunięcie blokad, które wstrzymują rozwój firmy lub start projektu. Zamiast przez pół roku przepalać oszczędności na fiksacjach i testowaniu błędnych założeń – w 90 minut weryfikujemy model biznesowy, źródła finansowania (bootstrap, granty, B2B) oraz realne wąskie gardła.',
      bullets: [
        'Formuła: konkretna praca na Twoich liczbach i materiałach, bez sztucznych pakietów i bez lania wody.',
        'Zysk czasowy: eliminacja kosztownych błędów, które mogłyby kosztować miesiące pracy.'
      ],
      ctaText: 'ZAREZERWUJ TERMIN SESJI (400 ZŁ)',
      ctaNote: 'Pojedyncza sesja 90 min doraźnej diagnozy',
      modalTitle: 'Rezerwacja: Mentoring Biznesowy',
      modalBody:
        'Pojedyncza sesja 90 minut doraźnej diagnozy biznesowej (400 zł). Skupiamy się na aktualnych barierach i weryfikacji założeń rynkowych.',
      modalActionUrl: 'mailto:lukasz@poruszek.pl?subject=Rezerwacja%20Sesji%20Biznesowej%20(90%20min)&body=Dzie%C5%84%20dobry%2C%0A%0Achc%C4%99%20zarezerwowa%C4%87%20sesj%C4%99%20diagnozy%20biznesowej%20(90%20min%20%2F%20400%20z%C5%82).%0AKr%C3%B3tki%20opis%20mojego%20wyzwania%3A%0A'
    },
    career: {
      id: 'career',
      kicker: 'KONSULTACJA 1:1',
      title: 'STRATEGIA I NAWIGACJA REKRUTACYJNA',
      badge: '300 ZŁ • SESJA 90 MINUT • SPOTKANIE ONLINE',
      description:
        'Dla osób, które wysyłają dziesiątki CV w próżnię i utknęły na rynku. Bez sztucznych mock-interviews i bez corporate bullshitu: bezwzględny audyt CV i profilu LinkedIn z perspektywy hiring managera oraz nauka sprowadzania rozmowy rekrutacyjnej na własne, najmocniejsze tory.',
      bullets: [
        'Cel: natychmiastowa eliminacja błędów dyskwalifikujących Cię na starcie i przejęcie inicjatywy w procesie rekrutacji.',
        'Bez AI i bez ściemy: realne mechanizmy decyzyjne w małych firmach i korporacjach.'
      ],
      ctaText: 'ZAREZERWUJ TERMIN SESJI (300 ZŁ)',
      ctaNote: 'Pojedyncza sesja 90 min audytu i strategii',
      modalTitle: 'Rezerwacja: Mentoring Kariery',
      modalBody:
        'Pojedyncza sesja 90 minut audytu CV/LinkedIn i strategii rekrutacyjnej (300 zł). Skupiamy się na eliminacji błędów i przejęciu inicjatywy.',
      modalActionUrl: 'mailto:lukasz@poruszek.pl?subject=Rezerwacja%20Sesji%20Kariery%20(90%20min)&body=Dzie%C5%84%20dobry%2C%0A%0Achc%C4%99%20zarezerwowa%C4%87%20sesj%C4%99%20mentoringu%20kariery%20(90%20min%20%2F%20300%20z%C5%82).%0AKr%C3%B3tki%20opis%20mojej%20sytuacji%3A%0A'
    }
  };

  let currentProductId = 'workshops';
  let isSectionActive = false;

  function initProductsView() {
    const container = document.getElementById('products-view-container');
    if (!container) return;

    const cards = container.querySelectorAll('.product-nav-card');
    const panelWrap = container.querySelector('.panel-content-wrap');
    const kickerEl = document.getElementById('product-kicker');
    const titleEl = document.getElementById('product-title');
    const badgeEl = document.getElementById('product-badge');
    const descEl = document.getElementById('product-description');
    const bulletsEl = document.getElementById('product-bullets');
    const ctaBtn = document.getElementById('product-cta-btn');
    const ctaText = document.getElementById('product-cta-text');
    const ctaNote = document.getElementById('product-cta-note');

    function selectProduct(productId) {
      if (!PRODUCTS_DATA[productId]) return;
      currentProductId = productId;
      const data = PRODUCTS_DATA[productId];

      // Zaktualizuj stan przycisków lewej kolumny
      cards.forEach((card) => {
        const isMatch = card.getAttribute('data-product') === productId;
        card.classList.toggle('is-active', isMatch);
        card.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      // Płynna mikro-animacja podmiany treści po prawej stronie
      if (panelWrap) {
        panelWrap.classList.add('is-fading');
        setTimeout(() => {
          if (kickerEl) kickerEl.textContent = data.kicker;
          if (titleEl) titleEl.textContent = data.title;
          if (badgeEl) badgeEl.textContent = data.badge;
          if (descEl) descEl.textContent = data.description;
          if (ctaText) ctaText.textContent = data.ctaText;
          if (ctaNote) ctaNote.textContent = data.ctaNote;

          if (bulletsEl) {
            bulletsEl.innerHTML = '';
            data.bullets.forEach((bullet) => {
              const li = document.createElement('li');
              li.className = 'panel-bullet-item';
              li.innerHTML = `
                <svg class="panel-bullet-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>${bullet}</span>
              `;
              bulletsEl.appendChild(li);
            });
          }

          panelWrap.classList.remove('is-fading');
        }, 140);
      }
    }

    // Obsługa kliknięć w karty wyboru
    cards.forEach((card) => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const pId = card.getAttribute('data-product');
        selectProduct(pId);
      });
    });

    // Obsługa kliknięcia w widżet CTA
    if (ctaBtn) {
      ctaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const data = PRODUCTS_DATA[currentProductId];
        if (currentProductId === 'workshops') {
          // Otwórz modal / przekierowanie na zapis warsztatowy
          openProductModal(data);
        } else {
          // Otwórz modal rezerwacji mentoringu
          openProductModal(data);
        }
      });
    }

    // Modal dialog logic
    setupProductModal();

    // Domyślny wybór pierwszej opcji (Warsztaty AI)
    selectProduct('workshops');
  }

  function setupProductModal() {
    const backdrop = document.getElementById('product-modal-backdrop');
    const closeBtn = document.getElementById('product-modal-close');
    if (!backdrop) return;

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        closeProductModal();
      });
    }

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeProductModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeProductModal();
      }
    });
  }

  function openProductModal(data) {
    const backdrop = document.getElementById('product-modal-backdrop');
    if (!backdrop) return;

    const modalTitle = document.getElementById('modal-dyn-title');
    const modalBadge = document.getElementById('modal-dyn-badge');
    const modalBody = document.getElementById('modal-dyn-body');
    const modalBtn = document.getElementById('modal-dyn-btn');

    if (modalTitle) modalTitle.textContent = data.modalTitle;
    if (modalBadge) modalBadge.textContent = data.badge;
    if (modalBody) modalBody.textContent = data.modalBody;
    if (modalBtn) {
      modalBtn.textContent = data.ctaText;
      modalBtn.onclick = function () {
        if (data.id === 'workshops') {
          window.location.href = data.modalActionUrl;
        } else {
          window.location.href = data.modalActionUrl;
        }
      };
    }

    backdrop.classList.add('is-open');
  }

  function closeProductModal() {
    const backdrop = document.getElementById('product-modal-backdrop');
    if (backdrop) backdrop.classList.remove('is-open');
  }

  // Hooki sterowania widocznością powiązane z silnikiem WebGL
  function setSectionState(active) {
    const container = document.getElementById('products-view-container');
    if (!container) return;

    if (active) {
      container.classList.add('is-active');
      isSectionActive = true;
    } else {
      container.classList.remove('is-active');
      isSectionActive = false;
      closeProductModal();
    }
  }

  window.onSection2Active = function () {
    setSectionState(true);
  };

  window.onSection2Inactive = function () {
    setSectionState(false);
  };

  // Fallback monitorujący stan w appStore w czasie rzeczywistym
  function startSyncLoop() {
    function checkState() {
      if (window.appStore && window.appStore.state) {
        const sub = window.appStore.state.currentSubSection;
        const shouldBeActive = (sub === 'data');
        if (shouldBeActive !== isSectionActive) {
          setSectionState(shouldBeActive);
        }
      }
      requestAnimationFrame(checkState);
    }
    requestAnimationFrame(checkState);
  }

  // Start po załadowaniu DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initProductsView();
      startSyncLoop();
    });
  } else {
    initProductsView();
    startSyncLoop();
  }
})();
