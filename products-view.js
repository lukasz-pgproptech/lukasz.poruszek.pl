/**
 * PRODUCTS KINETIC EDITORIAL VIEW CONTROLLER (Section 2 - "data")
 * Standard: Resn / Pioneer Editorial Brutalism & 3D WebGL Orbital Integration
 */

(function () {
  'use strict';

  const PRODUCTS_DATA = {
    workshops: {
      id: 'workshops',
      title: 'ORKIESTRACJA SYSTEMÓW AI',
      metric: '6 TYGODNI (6X 2H) · KAMERALNA GRUPA',
      body: '<p>Kompleksowy proces wdrożeniowy: od precyzyjnego promptowania na czacie webowym, przez pracę agentową, po tworzenie własnych wieloagentowych systemów i integrację serwerów MCP/API.</p><p>W cenie: spotkania online raz w tygodniu, nadzór nad zadaniami domowymi, pokoje wymiany wiedzy oraz indywidualne konsultacje 1:1 w razie trudniejszych zagadnień.</p>'
    },
    business: {
      id: 'business',
      title: 'DIAGNOZA BIZNESOWA I WALIDACJA',
      metric: 'SESJA 90 MINUT · SPOTKANIE ONLINE',
      body: '<p>Doraźna diagnoza i usunięcie blokad, które wstrzymują rozwój firmy lub start projektu. W 90 minut weryfikujemy model biznesowy, źródła finansowania (granty, bootstrap) oraz realne wąskie gardła, zamiast przez pół roku przepalać oszczędności na fiksacjach.</p><p>Konkretna praca na Twoich liczbach i materiałach, bez sztucznych pakietów i bez lania wody.</p>'
    },
    career: {
      id: 'career',
      title: 'STRATEGIA I NAWIGACJA REKRUTACYJNA',
      metric: 'SESJA 90 MINUT · SPOTKANIE ONLINE',
      body: '<p>Dla osób, które wysyłają dziesiątki CV w próżnię. Bez corporate bullshitu: audyt CV i profilu LinkedIn z perspektywy hiring managera oraz nauka sprowadzania rozmowy na własne, najmocniejsze tory.</p><p>Natychmiastowa eliminacja błędów dyskwalifikujących i przejęcie kontroli nad procesem rekrutacji.</p>'
    }
  };

  let currentProductId = 'workshops';
  window.currentScene2Product = 'workshops';
  let isSectionActive = false;

  // -------------------------------------------------------------
  // PŁYNNA PARALAKSA 3D KURSERA MYSZY (SYNCHRONICZNA Z KAMERĄ PIONEER)
  // -------------------------------------------------------------
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', function (e) {
    targetX = (e.clientX / window.innerWidth) * 2 - 1;
    targetY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  function updateParallax() {
    if (isSectionActive) {
      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;
      const container = document.getElementById('products-view-container');
      if (container) {
        container.style.setProperty('--mouse-x', mouseX.toFixed(4));
        container.style.setProperty('--mouse-y', mouseY.toFixed(4));
      }
    }
    requestAnimationFrame(updateParallax);
  }
  requestAnimationFrame(updateParallax);

  // -------------------------------------------------------------
  // UKRYWANIE ELEMENTÓW TYMCZASOWYCH WEBGL W SCENIE 2
  // -------------------------------------------------------------
  function hideWebGLScene2FallbackText() {
    if (window.view && window.view.sections && window.view.sections[1] && window.view.sections[1].data) {
      const s2 = window.view.sections[1].data;
      if (s2.title && s2.title.object) s2.title.object.visible = false;
      if (s2.bodyText && s2.bodyText.object) s2.bodyText.object.visible = false;
    }
  }

  // -------------------------------------------------------------
  // INICJALIZACJA WIDOKU PRODUKTÓW
  // -------------------------------------------------------------
  function initProductsView() {
    const container = document.getElementById('products-view-container');
    if (!container) return;

    const items = container.querySelectorAll('.product-item');
    const editorialWrap = document.getElementById('detailEditorial');
    const titleEl = document.getElementById('detailTitle');
    const metricEl = document.getElementById('detailMetric');
    const bodyEl = document.getElementById('detailBody');

    function selectProduct(productId) {
      if (!PRODUCTS_DATA[productId]) return;
      currentProductId = productId;
      window.currentScene2Product = productId;
      const data = PRODUCTS_DATA[productId];

      // Aktualizacja stanu lewej listy
      items.forEach((item) => {
        const isMatch = item.getAttribute('data-id') === productId;
        item.classList.toggle('is-active', isMatch);
        item.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      // Kinetyczna mikro-animacja prawej kolumny
      if (editorialWrap) {
        editorialWrap.classList.add('is-fading');
        setTimeout(() => {
          if (titleEl) titleEl.textContent = data.title;
          if (metricEl) metricEl.textContent = data.metric;
          if (bodyEl) bodyEl.innerHTML = data.body;
          editorialWrap.classList.remove('is-fading');
        }, 130);
      }

      // Reakcja natywnego widżetu 3D WebGL
      try {
        if (window.view && window.view.sections && window.view.sections[1] && window.view.sections[1].data) {
          const hotspot = window.view.sections[1].data.hotspot;
          if (hotspot && typeof hotspot.highlightHotspot === 'function') {
            hotspot.highlightHotspot();
          }
        }
      } catch (e) {}
    }

    // Obsługa kliknięć oraz hover na pozycjach
    items.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const pId = item.getAttribute('data-id');
        selectProduct(pId);
      });
      item.addEventListener('mouseenter', () => {
        const pId = item.getAttribute('data-id');
        selectProduct(pId);
      });
    });

    selectProduct('workshops');
  }

  // -------------------------------------------------------------
  // CYKL ŻYCIA SEKCJI (STEROWANY Z THREE.JS / SCROLLA)
  // -------------------------------------------------------------
  function setSectionState(active) {
    const container = document.getElementById('products-view-container');
    if (!container) return;

    if (active) {
      container.classList.add('is-active');
      isSectionActive = true;
      hideWebGLScene2FallbackText();
    } else {
      container.classList.remove('is-active');
      isSectionActive = false;
    }
  }

  window.onSection2Active = function () {
    setSectionState(true);
  };

  window.onSection2Inactive = function () {
    setSectionState(false);
  };

  // Pętla synchronizacyjna ze scrollem Pioneer
  function startSyncLoop() {
    function checkState() {
      if (isSectionActive) {
        hideWebGLScene2FallbackText();
      }
      if (window.scrollHandler && window.getSnapPos) {
        try {
          const snap = window.getSnapPos('science', 'data');
          const cur = window.scrollHandler.getScrollPosition();
          const isInRange = Math.abs(cur - snap) < 380;
          if (isInRange && !isSectionActive) {
            setSectionState(true);
          } else if (!isInRange && isSectionActive && Math.abs(cur - snap) > 520) {
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
