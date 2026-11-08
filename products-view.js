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

  const PRODUCT_DEEP_DIVE_DATA = {
    workshops: {
      badge: 'WARSZTATY PRAKTYCZNE',
      metric: '6 TYGODNI (6X 2H) · KAMERALNA GRUPA',
      title: 'ORKIESTRACJA SYSTEMÓW AI: OD PROMPTU DO CYFROWEGO ZESPOŁU',
      intro: 'Dla każdego, kto na co dzień korzysta z czatu AI w przeglądarce i czuje, że to za mało. Nie musisz być programistą – krok po kroku przejdziemy drogę od pojedynczych rozmów z modelem do budowy zautomatyzowanych, współpracujących ze sobą asystentów, którzy wykonują realną pracę na Twoich plikach.',
      modules: [
        {
          num: '01',
          title: 'Jak naprawdę „myśli” model i jak pisać prompty, które nie zawodzą',
          bullets: [
            'Pod maską LLM: kontekst, tokenizacja i dlaczego model czasem zmyśla (halucynacje).',
            'Techniki precyzyjnego sterowania odpowiedzią (few-shot, chain-of-thought).',
            'Efektywny warsztat pracy z asystentem AI w przeglądarce (Gemini Web).'
          ]
        },
        {
          num: '02',
          title: 'Wychodzimy z czatu — pierwsze kroki z agentami na Twoich plikach',
          bullets: [
            'Dlaczego okno czatu to wąskie gardło i czym różni się zwykły model od Agenta.',
            'Pierwsze uruchomienie i konfiguracja środowiska pracy (IDE) bez strachu.',
            'Bezpieczne czytanie, analiza i edycja Twoich lokalnych dokumentów i danych.'
          ]
        },
        {
          num: '03',
          title: 'Twój własny podręcznik dla AI (agents.md) — powtarzalny workflow',
          bullets: [
            'Koniec z powtarzaniem tych samych instrukcji przy każdej rozmowie.',
            'Architektura pliku zasad (agents.md / context.md): jak uczyć model Twoich reguł.',
            'Standaryzacja procesów: jak sprawić, by AI zawsze trzymało się Twojego schematu.'
          ]
        },
        {
          num: '04',
          title: 'Łączymy AI ze światem zewnętrznym — potęga narzędzi (MCP)',
          bullets: [
            'Czym jest Model Context Protocol (MCP) w prostych słowach.',
            'Podłączanie narzędzi: odczyt baz danych, wyszukiwanie w sieci, integracja z API.',
            'Jak dać agentowi „ręce” do wykonywania zadań w Twoim systemie.'
          ]
        },
        {
          num: '05',
          title: 'Tworzenie własnych agentów-specjalistów do konkretnych zadań',
          bullets: [
            'Projektowanie wąskich ról: Analityk, Copywriter, Programista, Tester.',
            'Pętle informacji zwrotnej (Feedback Loops) i samonaprawa błędów przez agenta.',
            'Kiedy dać agentowi pełną autonomię, a kiedy wprowadzić nadzór człowieka (HITL).'
          ]
        },
        {
          num: '06',
          title: 'Orkiestracja wieloagentowa — budujemy Twój cyfrowy zespół',
          bullets: [
            'Praca z platformą Antigravity app — łączenie wielu agentów w jeden zgrany ekosystem.',
            'Przenoszalność wiedzy: jak wdrożyć te same zasady w Cursorze, Claude Desktop i innych narzędziach.',
            'Podsumowanie, prezentacja wdrożonych projektów uczestników i dalsza ścieżka rozwoju.'
          ]
        }
      ],
      info: [
        { label: 'Forma', text: 'Spotkania na żywo online raz w tygodniu (6x 120 min) + nagrania z dożywotnim dostępem.' },
        { label: 'Wsparcie', text: 'Zamknięta społeczność, bieżący nadzór nad zadaniami domowymi oraz konsultacje 1:1 w razie trudności.' },
        { label: 'Wymagania', text: 'Doświadczenie w codziennym korzystaniu z czatu AI. Brak wymogu wcześniejszego kodowania.' }
      ],
      ctaText: 'Zapisz się na warsztaty',
      bookingTab: 'warsztaty'
    },
    business: {
      badge: 'KONSULTACJA 1:1',
      metric: 'SESJA 90 MINUT · SPOTKANIE ONLINE',
      title: 'DIAGNOZA BIZNESOWA I WALIDACJA PRZEDSIĘWZIĘCIA',
      intro: '90-minutowe, intensywne zderzenie Twojej strategii z praktyką rynkową. Bez teorii i bez lania wody. Skupiamy się na wybranym przez Ciebie, kluczowym wyzwaniu lub wąskim gardle, które blokuje Twój rozwój lub generuje niepotrzebne koszty.',
      modules: [
        {
          num: '01',
          title: 'Audyt obecnej oferty i modelu monetyzacji',
          bullets: [
            'Analiza struktury przychodów, marżowości oraz dotychczasowego cennika.',
            'Wskazanie miejsc, w których oddajesz marżę lub niepotrzebnie komplikujesz proces zakupu.'
          ]
        },
        {
          num: '02',
          title: 'Reality-check nowego pomysłu lub produktu',
          bullets: [
            'Bezwzględna walidacja założeń biznesowych przed zainwestowaniem budżetu.',
            'Projekt najprostszego i najtańszego testu rynkowego (MVP / Proof-of-Concept).'
          ]
        },
        {
          num: '03',
          title: 'Diagnoza wąskich gardeł w operacjach i sprzedaży',
          bullets: [
            'Zidentyfikowanie głównej blokady hamującej skalowanie lub konwersję.',
            'Plan natychmiastowych usprawnień procesowych do wdrożenia w 14 dni.'
          ]
        },
        {
          num: '04',
          title: 'Wybór ścieżki finansowania: dotacje vs bootstrap',
          bullets: [
            'Dopasowanie realnych źródeł finansowania (granty, B+R, aniołowie biznesu).',
            'Ocena ryzyk związanych z poszczególnymi formami pozyskania kapitału.'
          ]
        },
        {
          num: '05',
          title: 'Quick-wins wdrożenia AI w procesach firmowych',
          bullets: [
            'Wskazanie 2–3 powtarzalnych procesów w firmie, które można zautomatyzować od zaraz.',
            'Dobór gotowych narzędzi agentowych bez budowy drogich rozwiązań customowych.'
          ]
        },
        {
          num: '06',
          title: 'Konsultacja trudnej decyzji strategicznej',
          bullets: [
            'Zewnętrzny, bezstronny punkt widzenia przy rozdrożach (pivot, zamknięcie nierentownej linii, restrukturyzacja).',
            'Analiza scenariuszowa ryzyk i zysków.'
          ]
        }
      ],
      info: [
        { label: 'Forma', text: 'Indywidualne spotkanie online 1:1 (90 minut) na Google Meet.' },
        { label: 'Przygotowanie', text: 'Przed sesją przesyłasz materiały i liczby do wglądu – spotkanie zaczynamy od konkretów.' },
        { label: 'Rezultat', text: 'Zapis wideo sesji, notatka strategiczna z punktami decyzyjnymi oraz lista kroków Next Actions.' }
      ],
      ctaText: 'Zarezerwuj sesję 90 min',
      bookingTab: 'business'
    },
    career: {
      badge: 'KONSULTACJA 1:1',
      metric: 'SESJA 90 MINUT · SPOTKANIE ONLINE',
      title: 'STRATEGIA I NAWIGACJA REKRUTACYJNA',
      intro: 'Dla specjalistów i menedżerów, którzy wysyłają aplikacje bez odzewu lub stoją przed kluczową rozmową kwalifikacyjną. 90 minut pracy z perspektywy hiring managera – przełamanie schematów, eliminacja czerwonych flag i nauka prowadzenia rekrutacji na własnych warunkach.',
      modules: [
        {
          num: '01',
          title: 'Audyt CV i profilu LinkedIn z perspektywy Hiring Managera',
          bullets: [
            'Bezlitosna eliminacja „czerwonych flag”, lania wody i niewidocznych filtrów ATS.',
            'Przepisanie kluczowych osiągnięć na język wymiernych rezultatów biznesowych.'
          ]
        },
        {
          num: '02',
          title: 'Diagnoza przyczyn braku odzewu na rynku',
          bullets: [
            'Analiza dotychczasowych wysyłek, dopasowania stanowisk oraz targetowania branż.',
            'Korekta pozycjonowania zawodowego i odnalezienie Twojego unikalnego wyróżnika.'
          ]
        },
        {
          num: '03',
          title: 'Symulacja trudnej rozmowy kwalifikacyjnej (Mock Interview)',
          bullets: [
            'Przećwiczenie niewygodnych pytań (luki w CV, powody rozstań, trudne projekty).',
            'Nauka techniki przejmowania kontroli nad agendą spotkania rekrutacyjnego.'
          ]
        },
        {
          num: '04',
          title: 'Strategia negocjacji stawek i warunków zatrudnienia',
          bullets: [
            'Określenie realnego pułapu rynkowego i wyznaczenie progu minimalnego (Walk-Away Point).',
            'Scenariusze rozmowy o podwyżce lub ofercie końcowej bez palenia mostów.'
          ]
        },
        {
          num: '05',
          title: 'Wplecenie kompetencji AI do profilu zawodowego',
          bullets: [
            'Jak pokazać znajomość narzędzi AI i pracy agentowej jako twardą przewagę rynkową.',
            'Prezentacja projektów z wykorzystaniem AI w portfolio i na LinkedIn.'
          ]
        },
        {
          num: '06',
          title: 'Reality-check zmiany branży lub awansu na poziom C-Level',
          bullets: [
            'Obiektywna ocena szans i luk kompetencyjnych przy planowanym przebranżowieniu.',
            'Plan minimalizacji ryzyka finansowego i czasowego w okresie przejścia.'
          ]
        }
      ],
      info: [
        { label: 'Forma', text: 'Indywidualne spotkanie online 1:1 (90 minut) na Google Meet.' },
        { label: 'Przygotowanie', text: 'Przesyłasz aktualne CV, link do profilu LinkedIn oraz 2–3 ogłoszenia na docelowe role.' },
        { label: 'Rezultat', text: 'Zapis wideo sesji, naniesione korekty na dokumenty oraz skrypt odpowiedzi na trudne pytania.' }
      ],
      ctaText: 'Zarezerwuj sesję 90 min',
      bookingTab: 'career'
    }
  };

  let currentProductId = 'workshops';
  window.currentScene2Product = 'workshops';
  window.isDetailViewOpen = false;
  let isSectionActive = false;

  // -------------------------------------------------------------
  // RENDERING PEŁNOEKRANOWEGO WIDOKU SZCZEGÓŁOWEGO (DEEP DIVE)
  // -------------------------------------------------------------
  function renderDeepDive(productId) {
    const data = PRODUCT_DEEP_DIVE_DATA[productId] || PRODUCT_DEEP_DIVE_DATA.workshops;
    const deepDiveBody = document.getElementById('deepDiveBody');
    if (!deepDiveBody) return;

    const modulesHtml = data.modules.map(function (m) {
      const bulletsHtml = m.bullets.map(function (b) {
        return '<li>' + b + '</li>';
      }).join('');

      return (
        '<article class="deep-dive-card">' +
          '<div class="deep-dive-card-header">' +
            '<span class="deep-dive-card-num">' + m.num + '</span>' +
            '<h4 class="deep-dive-card-title">' + m.title + '</h4>' +
          '</div>' +
          '<ul class="deep-dive-card-bullets">' +
            bulletsHtml +
          '</ul>' +
        '</article>'
      );
    }).join('');

    const infoHtml = data.info.map(function (item) {
      return (
        '<div class="deep-dive-pill-item">' +
          '<span class="deep-dive-pill-label">' + item.label + ':</span>' +
          '<span>' + item.text + '</span>' +
        '</div>'
      );
    }).join('');

    deepDiveBody.innerHTML = (
      '<header class="deep-dive-header">' +
        '<div class="deep-dive-badges">' +
          '<span class="deep-dive-badge-category">' + data.badge + '</span>' +
          '<span class="deep-dive-badge-metric">' + data.metric + '</span>' +
        '</div>' +
        '<h2 class="deep-dive-title">' + data.title + '</h2>' +
        '<p class="deep-dive-intro">' + data.intro + '</p>' +
      '</header>' +
      '<div class="deep-dive-grid">' +
        modulesHtml +
      '</div>' +
      '<footer class="deep-dive-footer">' +
        '<div class="deep-dive-info-pills">' +
          infoHtml +
        '</div>' +
        '<button type="button" class="deep-dive-cta-btn" id="deepDiveCtaBtn" data-tab="' + data.bookingTab + '">' +
          '<span>' + data.ctaText + '</span>' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
            '<line x1="5" y1="12" x2="19" y2="12"></line>' +
            '<polyline points="12 5 19 12 12 19"></polyline>' +
          '</svg>' +
        '</button>' +
      '</footer>'
    );

    const ctaBtn = document.getElementById('deepDiveCtaBtn');
    if (ctaBtn) {
      ctaBtn.addEventListener('click', function () {
        const tab = this.getAttribute('data-tab') || productId;
        window.hideProductDetail();
        if (typeof window.openBookingModal === 'function') {
          window.openBookingModal(tab);
        }
      });
    }
  }

  window.showProductDetail = function (productId) {
    productId = productId || window.currentScene2Product || 'workshops';
    window.isDetailViewOpen = true;
    renderDeepDive(productId);

    const container = document.getElementById('products-view-container');
    const deepDive = document.getElementById('product-deep-dive');

    if (container) container.classList.add('is-detail-view');
    if (deepDive) {
      deepDive.classList.add('is-open');
      deepDive.setAttribute('aria-hidden', 'false');
    }

    // Ukryj widżety 3D w scenie 2
    if (typeof window.hideScene2Hotspots === 'function') {
      window.hideScene2Hotspots();
    } else if (window.view && window.view.sections && window.view.sections[1] && window.view.sections[1].data) {
      const s2 = window.view.sections[1].data;
      if (s2.hotspot && s2.hotspot.hide) s2.hotspot.hide({ delay: 0 });
      if (s2.moreHotspot && s2.moreHotspot.hide) s2.moreHotspot.hide({ delay: 0 });
    }
  };

  window.hideProductDetail = function () {
    window.isDetailViewOpen = false;
    const container = document.getElementById('products-view-container');
    const deepDive = document.getElementById('product-deep-dive');

    if (container) container.classList.remove('is-detail-view');
    if (deepDive) {
      deepDive.classList.remove('is-open');
      deepDive.setAttribute('aria-hidden', 'true');
    }

    // Przywróć widżety 3D w scenie 2
    if (typeof window.showScene2Hotspots === 'function') {
      window.showScene2Hotspots();
    } else if (window.view && window.view.sections && window.view.sections[1] && window.view.sections[1].data) {
      const s2 = window.view.sections[1].data;
      if (s2.hotspot && s2.hotspot.show) s2.hotspot.show({ delay: 0.1 });
      if (s2.moreHotspot && s2.moreHotspot.show) s2.moreHotspot.show({ delay: 0.1 });
    }
  };

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
        }, 110);
      }

      if (window.isDetailViewOpen) {
        renderDeepDive(productId);
      }

      // Dynamiczna aktualizacja tekstu natywnego widżetu 3D WebGL
      try {
        if (window.view && window.view.sections && window.view.sections[1] && window.view.sections[1].data) {
          const hotspot = window.view.sections[1].data.hotspot;
          if (hotspot && hotspot.text && hotspot.text.text && hotspot.text.text.geometry) {
            let targetText = "ZAPISZ SIĘ NA WARSZTATY";
            if (productId === 'business' || productId === 'career') {
              targetText = "ZAREZERWUJ SESJĘ 90 MIN";
            }
            const oldGeom = hotspot.text.text.geometry;
            if (oldGeom._opt && oldGeom._opt.text !== targetText) {
              const newGeom = new oldGeom.constructor(Object.assign({}, oldGeom._opt, { text: targetText }));
              hotspot.text.text.geometry.dispose();
              hotspot.text.text.geometry = newGeom;
              hotspot.text.updateText();
            }
            if (typeof hotspot.highlightHotspot === 'function') {
              hotspot.highlightHotspot();
            }
          }
        }
      } catch (e) {}
    }

    // Obsługa natychmiastowego hover na całej sekcji selektora z 3-warstwową detekcją
    function detectHoveredItem(e) {
      // 1. Bezpośredni closest
      let item = e.target && typeof e.target.closest === 'function' ? e.target.closest('.product-item') : null;
      // 2. elementsFromPoint (Chromium stacking fallback)
      if (!item && typeof document.elementsFromPoint === 'function' && e.clientX !== undefined) {
        const list = document.elementsFromPoint(e.clientX, e.clientY);
        for (let i = 0; i < list.length; i++) {
          if (list[i].classList && list[i].classList.contains('product-item')) {
            item = list[i];
            break;
          }
        }
      }
      // 3. Geometryczny bounding box check (niezawodny w 3D perspective)
      if (!item && e.clientX !== undefined) {
        items.forEach((it) => {
          const rect = it.getBoundingClientRect();
          if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
            item = it;
          }
        });
      }
      return item;
    }

    const handleHover = (e) => {
      const item = detectHoveredItem(e);
      if (item) {
        const pId = item.getAttribute('data-id');
        if (pId && pId !== currentProductId) {
          selectProduct(pId);
        }
      }
    };

    const selector = container.querySelector('.products-selector');
    if (selector) {
      selector.addEventListener('mouseover', handleHover, true);
      selector.addEventListener('pointerover', handleHover, true);
      selector.addEventListener('mousemove', handleHover, true);
      selector.addEventListener('pointermove', handleHover, true);
    }

    const leftCol = container.querySelector('.left-column');
    if (leftCol) {
      leftCol.addEventListener('mousemove', handleHover);
      leftCol.addEventListener('pointermove', handleHover);
    }

    // Bezpośrednia obsługa kliknięć oraz mouseenter na pozycjach
    items.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const pId = item.getAttribute('data-id');
        selectProduct(pId);
      });
      item.addEventListener('mouseenter', () => {
        const pId = item.getAttribute('data-id');
        if (pId && pId !== currentProductId) {
          selectProduct(pId);
        }
      });
      item.addEventListener('mouseover', () => {
        const pId = item.getAttribute('data-id');
        if (pId && pId !== currentProductId) {
          selectProduct(pId);
        }
      });
    });

    // Obsługa zamknięcia widoku Deep Dive
    const closeBtn = document.getElementById('deepDiveCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.hideProductDetail();
      });
    }

    const deepDiveOverlay = document.getElementById('product-deep-dive');
    if (deepDiveOverlay) {
      deepDiveOverlay.addEventListener('click', function (e) {
        if (e.target === deepDiveOverlay || (e.target && e.target.classList && e.target.classList.contains('deep-dive-scroll-container'))) {
          window.hideProductDetail();
        }
      });
    }

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && window.isDetailViewOpen) {
        window.hideProductDetail();
      }
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
      window.isSection2Active = true;
      hideWebGLScene2FallbackText();
    } else {
      container.classList.remove('is-active');
      isSectionActive = false;
      window.isSection2Active = false;
    }
  }

  window.onSection2Active = function () {
    setSectionState(true);
  };

  window.onSection2Inactive = function () {
    setSectionState(false);
  };

  // Pętla synchronizacyjna ze scrollem Pioneer oraz stanem menu
  function startSyncLoop() {
    function checkState() {
      const container = document.getElementById('products-view-container');
      const isMenuOpen = Boolean(window.appStore && window.appStore.state && window.appStore.state.navigation && window.appStore.state.navigation.menu);

      if (container) {
        if (isMenuOpen) {
          container.classList.add('is-menu-open');
        } else {
          container.classList.remove('is-menu-open');
        }
      }

      if (isSectionActive && !isMenuOpen) {
        hideWebGLScene2FallbackText();
      }

      if (window.scrollHandler && window.getSnapPos) {
        try {
          const snap = window.getSnapPos('science', 'data');
          const cur = (typeof window.scrollHandler.getScrollPosition === 'function')
            ? window.scrollHandler.getScrollPosition()
            : (window.scrollHandler.position !== undefined ? window.scrollHandler.position : (window.appStore && window.appStore.state && window.appStore.state.scroll ? window.appStore.state.scroll.position : 0));
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
