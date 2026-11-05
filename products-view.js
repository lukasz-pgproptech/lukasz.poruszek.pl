/**
 * PRODUCTS INTERACTIVE VIEW CONTROLLER (Section 2 - "data")
 * Standard: Resn / Pioneer Editorial Brutalism & Orbital Kinetic Elements
 */

(function () {
  'use strict';

  const PRODUCTS_DATA = {
    workshops: {
      id: 'workshops',
      title: 'ORKIESTRACJA SYSTEMÓW AI',
      metric: '1200 ZŁ · 6 TYGODNI (6X 2H) · KAMERALNA GRUPA',
      body: '<p>Kompleksowy proces wdrożeniowy: od precyzyjnego promptowania na czacie webowym, przez pracę agentową, po tworzenie własnych wieloagentowych systemów i integrację serwerów MCP/API.</p><p>W cenie: spotkania online raz w tygodniu, nadzór nad zadaniami domowymi, pokoje wymiany wiedzy oraz indywidualne konsultacje 1:1 w razie trudniejszych zagadnień.</p>',
      widgetHtml: 'ZAPISZ SIĘ NA<br>WARSZTATY',
      modalTitle: 'Zapisz się na warsztaty AI',
      modalBadge: '1200 ZŁ · 6 TYGODNI · KAMERALNA GRUPA',
      modalBody: 'Cykl 6-tygodniowy (6 spotkań po 2h). Kameralna grupa (8–15 osób). Wybierz dogodny termin edycji i dołącz do grupy praktyków orkiestracji AI.',
      modalCtaText: 'PRZEJDŹ DO ZAPISU',
      modalActionUrl: '/mockup-warsztaty.html'
    },
    business: {
      id: 'business',
      title: 'DIAGNOZA BIZNESOWA I WALIDACJA',
      metric: '400 ZŁ · SESJA 90 MINUT · SPOTKANIE ONLINE',
      body: '<p>Doraźna diagnoza i usunięcie blokad, które wstrzymują rozwój firmy lub start projektu. W 90 minut weryfikujemy model biznesowy, źródła finansowania (granty, bootstrap) oraz realne wąskie gardła, zamiast przez pół roku przepalać oszczędności na fiksacjach.</p><p>Konkretna praca na Twoich liczbach i materiałach, bez sztucznych pakietów i bez lania wody.</p>',
      widgetHtml: 'ZAREZERWUJ<br>SESJĘ 90 MIN',
      modalTitle: 'Rezerwacja: Mentoring Biznesowy',
      modalBadge: '400 ZŁ · SESJA 90 MINUT',
      modalBody: 'Pojedyncza sesja 90 minut doraźnej diagnozy biznesowej (400 zł). Skupiamy się na aktualnych barierach i weryfikacji założeń rynkowych.',
      modalCtaText: 'ZAREZERWUJ TERMIN',
      modalActionUrl: 'mailto:lukasz@poruszek.pl?subject=Rezerwacja%20Sesji%20Biznesowej%20(90%20min)&body=Dzie%C5%84%20dobry%2C%0A%0Achc%C4%99%20zarezerwowa%C4%87%20sesj%C4%99%20diagnozy%20biznesowej%20(90%20min%20%2F%20400%20z%C5%82).%0AKr%C3%B3tki%20opis%20mojego%20wyzwania%3A%0A'
    },
    career: {
      id: 'career',
      title: 'STRATEGIA I NAWIGACJA REKRUTACYJNA',
      metric: '300 ZŁ · SESJA 90 MINUT · SPOTKANIE ONLINE',
      body: '<p>Dla osób, które wysyłają dziesiątki CV w próżnię. Bez corporate bullshitu: audyt CV i profilu LinkedIn z perspektywy hiring managera oraz nauka sprowadzania rozmowy na własne, najmocniejsze tory.</p><p>Natychmiastowa eliminacja błędów dyskwalifikujących i przejęcie kontroli nad procesem rekrutacji.</p>',
      widgetHtml: 'ZAREZERWUJ<br>SESJĘ 90 MIN',
      modalTitle: 'Rezerwacja: Mentoring Kariery',
      modalBadge: '300 ZŁ · SESJA 90 MINUT',
      modalBody: 'Pojedyncza sesja 90 minut audytu CV/LinkedIn i strategii rekrutacyjnej (300 zł). Skupiamy się na eliminacji błędów i przejęciu inicjatywy.',
      modalCtaText: 'ZAREZERWUJ TERMIN',
      modalActionUrl: 'mailto:lukasz@poruszek.pl?subject=Rezerwacja%20Sesji%20Kariery%20(90%20min)&body=Dzie%C5%84%20dobry%2C%0A%0Achc%C4%99%20zarezerwowa%C4%87%20sesj%C4%99%20mentoringu%20kariery%20(90%20min%20%2F%20300%20z%C5%82).%0AKr%C3%B3tki%20opis%20mojej%20sytuacji%3A%0A'
    }
  };

  let currentProductId = 'workshops';
  let isSectionActive = false;

  function hideWebGLScene2Text() {
    if (window.view && window.view.sections && window.view.sections[1] && window.view.sections[1].data) {
      const s2 = window.view.sections[1].data;
      if (s2.title && s2.title.object) s2.title.object.visible = false;
      if (s2.bodyText && s2.bodyText.object) s2.bodyText.object.visible = false;
    }
  }

  function initProductsView() {
    const container = document.getElementById('products-view-container');
    if (!container) return;

    const items = container.querySelectorAll('.product-item');
    const editorialWrap = document.getElementById('detailEditorial');
    const titleEl = document.getElementById('detailTitle');
    const metricEl = document.getElementById('detailMetric');
    const bodyEl = document.getElementById('detailBody');
    const circleWidget = document.getElementById('circularWidget');
    const circleText = document.getElementById('circleText');

    function selectProduct(productId) {
      if (!PRODUCTS_DATA[productId]) return;
      currentProductId = productId;
      const data = PRODUCTS_DATA[productId];

      // Aktualizacja stanu lewej listy
      items.forEach((item) => {
        const isMatch = item.getAttribute('data-id') === productId;
        item.classList.toggle('is-active', isMatch);
        item.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      // Płynna mikro-animacja prawej kolumny
      if (editorialWrap) {
        editorialWrap.classList.add('is-fading');
        setTimeout(() => {
          if (titleEl) titleEl.textContent = data.title;
          if (metricEl) metricEl.textContent = data.metric;
          if (bodyEl) bodyEl.innerHTML = data.body;
          if (circleText) circleText.innerHTML = data.widgetHtml;
          editorialWrap.classList.remove('is-fading');
        }, 120);
      }
    }

    // Kliknięcia w pozycje
    items.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const pId = item.getAttribute('data-id');
        selectProduct(pId);
      });
    });

    // Kliknięcie w okrągły widżet
    if (circleWidget) {
      circleWidget.addEventListener('click', (e) => {
        e.preventDefault();
        const data = PRODUCTS_DATA[currentProductId];
        openProductModal(data);
      });
    }

    setupProductModal();
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
    if (modalBadge) modalBadge.textContent = data.modalBadge;
    if (modalBody) modalBody.textContent = data.modalBody;
    if (modalBtn) {
      modalBtn.textContent = data.modalCtaText;
      modalBtn.onclick = function () {
        window.location.href = data.modalActionUrl;
      };
    }

    backdrop.classList.add('is-open');
  }

  function closeProductModal() {
    const backdrop = document.getElementById('product-modal-backdrop');
    if (backdrop) backdrop.classList.remove('is-open');
  }

  function setSectionState(active) {
    const container = document.getElementById('products-view-container');
    if (!container) return;

    if (active) {
      container.classList.add('is-active');
      isSectionActive = true;
      hideWebGLScene2Text();
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

  function startSyncLoop() {
    function checkState() {
      if (isSectionActive) {
        hideWebGLScene2Text();
      }
      if (window.scrollHandler && window.getSnapPos) {
        try {
          const snap = window.getSnapPos("science", "data");
          const cur = window.scrollHandler.getScrollPosition();
          const isInRange = Math.abs(cur - snap) < 350;
          if (isInRange && !isSectionActive) {
            setSectionState(true);
          } else if (!isInRange && isSectionActive && Math.abs(cur - snap) > 500) {
            setSectionState(false);
          }
        } catch (e) {}
      }
      requestAnimationFrame(checkState);
    }
    requestAnimationFrame(checkState);
  }

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
