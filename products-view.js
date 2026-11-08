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

  const PRODUCT_TIMELINE_DATA = {
    workshops: {
      id: 'workshops',
      badge: 'WARSZTATY PRAKTYCZNE · 6 TYGODNI (6X 2H) · KAMERALNA GRUPA',
      title: 'ORKIESTRACJA SYSTEMÓW AI: OD PROMPTU DO CYFROWEGO ZESPOŁU',
      intro: 'Dla każdego, kto na co dzień korzysta z czatu AI w przeglądarce i czuje, że to za mało. Nie musisz być programistą – krok po kroku przejdziemy drogę od pojedynczych rozmów z modelem do budowy zautomatyzowanych, współpracujących asystentów, którzy wykonują realną pracę na Twoich plikach.',
      steps: [
        {
          num: '01',
          shortTitle: 'PROMPTOWANIE',
          tag: 'KROK 01 / 06 · FUNDAMENTY I PROMPTOWANIE',
          heading: 'Jak naprawdę „myśli” model i jak pisać prompty, które nie zawodzą',
          paragraphs: [
            'Pod maską LLM: okno kontekstu, tokenizacja i mechanizm powstawania halucynacji.',
            'Techniki precyzyjnego sterowania modelem oraz eliminacja losowości w powtarzalnych zadaniach biznesowych.',
            'Efektywny warsztat codziennej pracy z asystentem AI bezpośrednio w przeglądarce (Gemini Web).'
          ]
        },
        {
          num: '02',
          shortTitle: 'PRACA NA PLIKACH',
          tag: 'KROK 02 / 06 · WYJŚCIE Z CZATU DO IDE',
          heading: 'Wychodzimy z czatu — pierwsze kroki z agentami na Twoich plikach',
          paragraphs: [
            'Dlaczego okno czatu to wąskie gardło i czym w praktyce różni się zwykły model od autonomicznego Agenta.',
            'Pierwsze uruchomienie i bezstresowa konfiguracja profesjonalnego środowiska pracy (IDE).',
            'Bezpieczne czytanie, analiza i automatyczna edycja lokalnych dokumentów, arkuszy oraz baz wiedzy.'
          ]
        },
        {
          num: '03',
          shortTitle: 'AGENTS.MD',
          tag: 'KROK 03 / 06 · REGUŁY I WORKFLOW',
          heading: 'Twój własny podręcznik dla AI (agents.md) — powtarzalny workflow',
          paragraphs: [
            'Koniec z powtarzaniem tych samych instrukcji i kontekstu przy każdej nowej rozmowie.',
            'Architektura pliku zasad (agents.md): jak skutecznie uczyć model Twoich reguł biznesowych.',
            'Standaryzacja procesów i schematów, dzięki którym AI zawsze trzyma się wyznaczonych ram jakościowych.'
          ]
        },
        {
          num: '04',
          shortTitle: 'NARZĘDZIA MCP',
          tag: 'KROK 04 / 06 · EKOSYSTEM NARZĘDZIOWY',
          heading: 'Łączymy AI ze światem zewnętrznym — potęga narzędzi (MCP)',
          paragraphs: [
            'Czym jest Model Context Protocol (MCP) w prostych, zrozumiałych słowach.',
            'Podłączanie narzędzi zewnętrznych: odczyt baz danych, wyszukiwanie na żywo w sieci oraz integracja z API.',
            'Wyposażenie agenta w cyfrowe ręce do wykonywania realnych zadań operacyjnych w Twoim systemie.'
          ]
        },
        {
          num: '05',
          shortTitle: 'TWORZENIE AGENTÓW',
          tag: 'KROK 05 / 06 · WĄSKIE ROLE',
          heading: 'Tworzenie własnych agentów-specjalistów do konkretnych zadań',
          paragraphs: [
            'Projektowanie wąskich ról: dedykowany analityk, copywriter, audytor kodu czy automatyczny tester.',
            'Pętle informacji zwrotnej (Feedback Loops) i techniki samonaprawy błędów przez agenta.',
            'Wyznaczanie granic autonomii: kiedy agent decyduje sam, a kiedy wymagana jest autoryzacja człowieka (HITL).'
          ]
        },
        {
          num: '06',
          shortTitle: 'ORKIESTRACJA',
          tag: 'KROK 06 / 06 · CYFROWY ZESPÓŁ',
          heading: 'Orkiestracja wieloagentowa — budujemy Twój cyfrowy zespół',
          paragraphs: [
            'Praca w środowisku Antigravity: łączenie wyspecjalizowanych agentów w jeden współpracujący ekosystem.',
            'Przenoszalność wiedzy: jak wdrożyć te same zasady w Cursorze, Claude Desktop i innych narzędziach.',
            'Wdrożenie gotowych projektów uczestników, sesja konsultacji oraz wyznaczenie ścieżki dalszego rozwoju.'
          ]
        }
      ]
    },
    business: {
      id: 'business',
      badge: 'KONSULTACJA 1:1 · SESJA 90 MINUT · SPOTKANIE ONLINE',
      title: 'DIAGNOZA BIZNESOWA I WALIDACJA PRZEDSIĘWZIĘCIA',
      intro: '90-minutowe, intensywne zderzenie Twojej strategii z praktyką rynkową. Bez teorii i bez lania wody. Skupiamy się na wybranym przez Ciebie wyzwaniu lub wąskim gardle, które blokuje Twój rozwój lub generuje niepotrzebne koszty.',
      steps: [
        {
          num: '01',
          shortTitle: 'MONETYZACJA',
          tag: 'OBSZAR 01 / 06 · OFERTA I CENNIK',
          heading: 'Audyt obecnej oferty i modelu monetyzacji',
          paragraphs: [
            'Szczegółowa analiza struktury przychodów, marżowości oraz dotychczasowego cennika.',
            'Wskazanie miejsc, w których oddajesz marżę lub niepotrzebnie komplikujesz ścieżkę zakupu klientowi.'
          ]
        },
        {
          num: '02',
          shortTitle: 'WALIDACJA',
          tag: 'OBSZAR 02 / 06 · REALITY-CHECK',
          heading: 'Reality-check nowego pomysłu lub produktu',
          paragraphs: [
            'Bezwzględna walidacja założeń biznesowych przed zainwestowaniem oszczędności, budżetu i czasu.',
            'Projekt najprostszego i najtańszego testu rynkowego (MVP / Proof-of-Concept) w realnych warunkach.'
          ]
        },
        {
          num: '03',
          shortTitle: 'WĄSKIE GARDŁA',
          tag: 'OBSZAR 03 / 06 · BLOKADY ROZWOJU',
          heading: 'Diagnoza wąskich gardeł w operacjach i sprzedaży',
          paragraphs: [
            'Zidentyfikowanie głównej blokady hamującej skalowanie biznesu lub konwersję w lejku sprzedażowym.',
            'Konkretny plan natychmiastowych usprawnień procesowych do wdrożenia w Twojej firmie w 14 dni.'
          ]
        },
        {
          num: '04',
          shortTitle: 'FINANSOWANIE',
          tag: 'OBSZAR 04 / 06 · KAPITAŁ',
          heading: 'Wybór ścieżki finansowania: dotacje vs bootstrap',
          paragraphs: [
            'Dopasowanie realnych źródeł finansowania pod Twój model (granty, B+R, aniołowie biznesu).',
            'Obiektywna ocena ryzyk prawnych i kosztów operacyjnych związanych z pozyskaniem kapitału zewnętrznego.'
          ]
        },
        {
          num: '05',
          shortTitle: 'WDROŻENIE AI',
          tag: 'OBSZAR 05 / 06 · QUICK-WINS AI',
          heading: 'Quick-wins wdrożenia AI w procesach firmowych',
          paragraphs: [
            'Wskazanie 2–3 powtarzalnych procesów w firmie, które można zautomatyzować narzędziami AI od zaraz.',
            'Dobór sprawdzonych narzędzi agentowych bez konieczności budowy drogich rozwiązań programistycznych.'
          ]
        },
        {
          num: '06',
          shortTitle: 'DECYZJA STRATEGICZNA',
          tag: 'OBSZAR 06 / 06 · KONSULTACJA ROZDROŻA',
          heading: 'Konsultacja trudnej decyzji strategicznej',
          paragraphs: [
            'Zewnętrzny, bezstronny punkt widzenia przy rozdrożach (pivot, zamknięcie nierentownej linii, restrukturyzacja).',
            'Analiza scenariuszowa ryzyk i zysków w horyzoncie kolejnych miesięcy działania firmy.'
          ]
        }
      ]
    },
    career: {
      id: 'career',
      badge: 'KONSULTACJA 1:1 · SESJA 90 MINUT · SPOTKANIE ONLINE',
      title: 'STRATEGIA I NAWIGACJA REKRUTACYJNA',
      intro: 'Dla specjalistów i menedżerów, którzy wysyłają aplikacje bez odzewu lub stoją przed kluczową rozmową kwalifikacyjną. 90 minut pracy z perspektywy hiring managera – przełamanie schematów, eliminacja czerwonych flag i nauka prowadzenia rekrutacji na własnych warunkach.',
      steps: [
        {
          num: '01',
          shortTitle: 'AUDYT CV & LINKEDIN',
          tag: 'OBSZAR 01 / 06 · AUDYT DOKUMENTÓW',
          heading: 'Audyt CV i profilu LinkedIn z perspektywy Hiring Managera',
          paragraphs: [
            'Bezlitosna eliminacja czerwonych flag, lania wody i niewidocznych filtrów automatycznych systemów ATS.',
            'Przepisanie kluczowych osiągnięć zawodowych na twardy język wymiernych rezultatów biznesowych.'
          ]
        },
        {
          num: '02',
          shortTitle: 'DIAGNOZA RYNKOWA',
          tag: 'OBSZAR 02 / 06 · POZYCJONOWANIE',
          heading: 'Diagnoza przyczyn braku odzewu na rynku',
          paragraphs: [
            'Dokładna analiza dotychczasowych wysyłek, dopasowania stanowisk oraz targetowania branż.',
            'Korekta pozycjonowania zawodowego i odnalezienie Twojego unikalnego wyróżnika kompetencyjnego.'
          ]
        },
        {
          num: '03',
          shortTitle: 'SYMULACJA ROZMOWY',
          tag: 'OBSZAR 03 / 06 · MOCK INTERVIEW',
          heading: 'Symulacja trudnej rozmowy kwalifikacyjnej (Mock Interview)',
          paragraphs: [
            'Przećwiczenie niewygodnych pytań rekruterów o luki w CV, powody rozstań i trudne projekty.',
            'Nauka techniki przejmowania kontroli nad agendą i sprowadzania rozmowy na własne najmocniejsze tory.'
          ]
        },
        {
          num: '04',
          shortTitle: 'NEGOCJACJE',
          tag: 'OBSZAR 04 / 06 · WYNAGRODZENIE',
          heading: 'Strategia negocjacji stawek i warunków zatrudnienia',
          paragraphs: [
            'Określenie realnego pułapu rynkowego dla Twoich umiejętności i wyznaczenie progu minimalnego (Walk-Away Point).',
            'Scenariusze rozmowy o podwyżce lub ofercie końcowej bez ryzyka spalenia mostów.'
          ]
        },
        {
          num: '05',
          shortTitle: 'KOMPETENCJE AI',
          tag: 'OBSZAR 05 / 06 · TWARDY WYRÓŻNIK',
          heading: 'Wplecenie kompetencji AI do profilu zawodowego',
          paragraphs: [
            'Jak pokazać znajomość narzędzi AI i pracy agentowej jako twardą przewagę rynkową w Twojej roli.',
            'Przekonująca prezentacja projektów z wykorzystaniem AI w portfolio oraz w profilu LinkedIn.'
          ]
        },
        {
          num: '06',
          shortTitle: 'PRZEBRANŻOWIENIE',
          tag: 'OBSZAR 06 / 06 · REALITY-CHECK ŚCIEŻKI',
          heading: 'Reality-check zmiany branży lub awansu na poziom C-Level',
          paragraphs: [
            'Obiektywna ocena szans i luk kompetencyjnych przy planowanym przebranżowieniu lub awansie.',
            'Plan minimalizacji ryzyka finansowego i czasowego w newralgicznym okresie przejścia.'
          ]
        }
      ]
    }
  };

  let currentProductId = 'workshops';
  window.currentScene2Product = 'workshops';
  window.isDetailViewOpen = false;
  let isSectionActive = false;
  let currentStepIndex = 0;
  let isWheelLocked = false;

  // -------------------------------------------------------------
  // RENDERING PEŁNOEKRANOWEJ OSI NARRACYJNEJ (TIMELINE ROADMAP)
  // -------------------------------------------------------------
  function renderTimelineStage(productId, stepIndex) {
    const data = PRODUCT_TIMELINE_DATA[productId] || PRODUCT_TIMELINE_DATA.workshops;
    const stageEl = document.getElementById('timelineStage');
    if (!stageEl) return;

    const step = data.steps[stepIndex] || data.steps[0];
    const parasHtml = step.paragraphs.map(function (p) {
      return '<p>' + p + '</p>';
    }).join('');

    stageEl.classList.add('is-changing');
    setTimeout(function () {
      stageEl.innerHTML = (
        '<div class="stage-step-tag">' + step.tag + '</div>' +
        '<h3 class="stage-heading">' + step.heading + '</h3>' +
        '<div class="stage-paragraphs">' +
          parasHtml +
        '</div>'
      );
      stageEl.classList.remove('is-changing');
    }, 110);
  }

  function updateRoadmapActiveState(stepIndex, totalSteps) {
    const bar = document.getElementById('timelineRoadmapBar');
    if (!bar) return;

    const progressEl = bar.querySelector('.roadmap-track-progress');
    if (progressEl) {
      const pct = totalSteps > 1 ? (stepIndex / (totalSteps - 1)) * 100 : 0;
      progressEl.style.width = pct.toFixed(1) + '%';
    }

    const nodes = bar.querySelectorAll('.roadmap-node');
    nodes.forEach(function (n, idx) {
      const isActive = idx === stepIndex;
      n.classList.toggle('is-active', isActive);
      n.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function renderTimelineRoadmap(productId, initialStepIndex) {
    const data = PRODUCT_TIMELINE_DATA[productId] || PRODUCT_TIMELINE_DATA.workshops;
    const bar = document.getElementById('timelineRoadmapBar');
    if (!bar) return;

    const steps = data.steps;
    const pct = steps.length > 1 ? (initialStepIndex / (steps.length - 1)) * 100 : 0;

    const nodesHtml = steps.map(function (s, idx) {
      const activeClass = idx === initialStepIndex ? ' is-active' : '';
      return (
        '<button type="button" class="roadmap-node' + activeClass + '" data-step="' + idx + '" aria-selected="' + (idx === initialStepIndex) + '" aria-label="' + s.shortTitle + '">' +
          '<span class="roadmap-node-dot"></span>' +
          '<div class="roadmap-node-label">' +
            '<span class="roadmap-node-num">' + s.num + '</span>' +
            '<span class="roadmap-node-title">' + s.shortTitle + '</span>' +
          '</div>' +
        '</button>'
      );
    }).join('');

    bar.innerHTML = (
      '<div class="roadmap-hint">' +
        '<svg width="12" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<rect x="5" y="2" width="14" height="20" rx="7"></rect>' +
          '<line x1="12" y1="6" x2="12" y2="10"></line>' +
        '</svg>' +
        '<span>PRZEWIJAJ KÓŁKIEM MYSZY LUB KLIKNIJ PUNKT ROADMAPY</span>' +
      '</div>' +
      '<div class="roadmap-track-container">' +
        '<div class="roadmap-track-line"></div>' +
        '<div class="roadmap-track-progress" style="width:' + pct.toFixed(1) + '%;"></div>' +
        '<div class="roadmap-nodes-group">' +
          nodesHtml +
        '</div>' +
      '</div>'
    );

    const nodeButtons = bar.querySelectorAll('.roadmap-node');
    nodeButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const targetStep = parseInt(this.getAttribute('data-step'), 10);
        if (!isNaN(targetStep)) {
          goToStep(targetStep);
        }
      });
    });
  }

  function goToStep(newIndex) {
    const data = PRODUCT_TIMELINE_DATA[currentProductId] || PRODUCT_TIMELINE_DATA.workshops;
    if (newIndex < 0 || newIndex >= data.steps.length) return;
    currentStepIndex = newIndex;
    renderTimelineStage(currentProductId, currentStepIndex);
    updateRoadmapActiveState(currentStepIndex, data.steps.length);
  }

  function renderTimelineView(productId, stepIndex) {
    const data = PRODUCT_TIMELINE_DATA[productId] || PRODUCT_TIMELINE_DATA.workshops;
    const headerEl = document.getElementById('timelineHeader');
    if (headerEl) {
      headerEl.innerHTML = (
        '<div class="timeline-badge">' + data.badge + '</div>' +
        '<h2 class="timeline-main-title">' + data.title + '</h2>' +
        '<p class="timeline-main-intro">' + data.intro + '</p>'
      );
    }
    renderTimelineStage(productId, stepIndex);
    renderTimelineRoadmap(productId, stepIndex);
  }

  // -------------------------------------------------------------
  // AKTUALIZACJA TEKSTU I IMPULSU NATYWNEGO WIDŻETU 3D WEBGL
  // -------------------------------------------------------------
  function update3DHotspotText(productId) {
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

  window.showProductDetail = function (productId) {
    productId = productId || window.currentScene2Product || 'workshops';
    currentProductId = productId;
    window.currentScene2Product = productId;
    window.isDetailViewOpen = true;
    currentStepIndex = 0;
    renderTimelineView(productId, 0);

    const container = document.getElementById('products-view-container');
    const deepDive = document.getElementById('product-deep-dive');

    if (container) container.classList.add('is-detail-view');
    if (deepDive) {
      deepDive.classList.add('is-open');
      deepDive.setAttribute('aria-hidden', 'false');
    }

    // W trybie osi narracyjnej ukrywamy tylko widżet "DOWIEDZ SIĘ WIĘCEJ",
    // natomiast natywny widżet 3D WebGL (Zapisz się / Zarezerwuj) POZOSTAJE WIDOCZNY w prawym dolnym rogu!
    try {
      if (window.view && window.view.sections && window.view.sections[1] && window.view.sections[1].data) {
        const s2 = window.view.sections[1].data;
        if (s2.moreHotspot && s2.moreHotspot.hide) s2.moreHotspot.hide({ delay: 0 });
        if (s2.hotspot && s2.hotspot.show) s2.hotspot.show({ delay: 0.1 });
      }
    } catch (e) {}

    update3DHotspotText(productId);
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

    // Przywracamy oba widżety 3D w Scenie 2
    try {
      if (window.view && window.view.sections && window.view.sections[1] && window.view.sections[1].data) {
        const s2 = window.view.sections[1].data;
        if (s2.hotspot && s2.hotspot.show) s2.hotspot.show({ delay: 0.1 });
        if (s2.moreHotspot && s2.moreHotspot.show) s2.moreHotspot.show({ delay: 0.1 });
      }
    } catch (e) {}

    update3DHotspotText(currentProductId);
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
        renderTimelineView(productId, currentStepIndex);
      }

      // Dynamiczna aktualizacja tekstu natywnego widżetu 3D WebGL
      update3DHotspotText(productId);
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

    // Obsługa zamknięcia widoku osi narracyjnej
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
        if (e.target === deepDiveOverlay) {
          window.hideProductDetail();
        }
      });
    }

    // Obsługa kliknięcia i najechania na natywny widżet 3D WebGL w trybie osi narracyjnej
    const hotspotHitArea = document.getElementById('timelineHotspotHitArea');
    if (hotspotHitArea) {
      hotspotHitArea.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof window.openBookingModal === 'function') {
          window.openBookingModal(currentProductId || window.currentScene2Product || 'workshops');
        }
      });

      const highlight3D = () => {
        try {
          if (window.view && window.view.sections && window.view.sections[1] && window.view.sections[1].data) {
            const hs = window.view.sections[1].data.hotspot;
            if (hs && typeof hs.highlightHotspot === 'function') {
              hs.highlightHotspot();
            }
          }
        } catch (err) {}
      };

      hotspotHitArea.addEventListener('mouseenter', highlight3D);
      hotspotHitArea.addEventListener('pointerover', highlight3D);
    }

    // -------------------------------------------------------------
    // PRZEWIJANIE KÓŁKIEM MYSZY WIDOKU OSI NARRACYJNEJ (KROK PO KROKU)
    // -------------------------------------------------------------
    let wheelCooldown = false;
    let wheelDeltaAccum = 0;
    let wheelResetTimer = null;

    window.addEventListener('wheel', function (e) {
      if (!window.isDetailViewOpen) return;

      // Zatrzymujemy natychmiast przewijanie sceny 3D w Pioneerze
      e.preventDefault();
      e.stopImmediatePropagation();

      if (wheelCooldown) return;

      const dy = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      wheelDeltaAccum += dy;

      clearTimeout(wheelResetTimer);
      wheelResetTimer = setTimeout(() => {
        wheelDeltaAccum = 0;
      }, 200);

      const THRESHOLD = 35;
      const data = PRODUCT_TIMELINE_DATA[currentProductId] || PRODUCT_TIMELINE_DATA.workshops;
      const totalSteps = data.steps.length;

      if (wheelDeltaAccum > THRESHOLD) {
        wheelCooldown = true;
        wheelDeltaAccum = 0;
        if (currentStepIndex < totalSteps - 1) {
          goToStep(currentStepIndex + 1);
        }
        setTimeout(() => { wheelCooldown = false; }, 360);
      } else if (wheelDeltaAccum < -THRESHOLD) {
        wheelCooldown = true;
        wheelDeltaAccum = 0;
        if (currentStepIndex > 0) {
          goToStep(currentStepIndex - 1);
        }
        setTimeout(() => { wheelCooldown = false; }, 360);
      }
    }, { passive: false, capture: true });

    // -------------------------------------------------------------
    // NAWIGACJA KLAWIATURĄ (STRZAŁKI, SPACJA, ESCAPE)
    // -------------------------------------------------------------
    window.addEventListener('keydown', function (e) {
      if (!window.isDetailViewOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        window.hideProductDetail();
        return;
      }

      const data = PRODUCT_TIMELINE_DATA[currentProductId] || PRODUCT_TIMELINE_DATA.workshops;
      const totalSteps = data.steps.length;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        if (currentStepIndex < totalSteps - 1) {
          goToStep(currentStepIndex + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentStepIndex > 0) {
          goToStep(currentStepIndex - 1);
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToStep(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToStep(totalSteps - 1);
      }
    }, { capture: true });

    // -------------------------------------------------------------
    // GESTY PRZESUWANIA (TOUCH SWIPE) NA URZĄDZENIACH DOTYKOWYCH
    // -------------------------------------------------------------
    let touchStartX = 0;
    let touchStartY = 0;

    window.addEventListener('touchstart', function (e) {
      if (!window.isDetailViewOpen) return;
      if (e.touches && e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', function (e) {
      if (!window.isDetailViewOpen) return;
      if (e.changedTouches && e.changedTouches.length > 0) {
        const diffX = touchStartX - e.changedTouches[0].clientX;
        const diffY = touchStartY - e.changedTouches[0].clientY;
        const data = PRODUCT_TIMELINE_DATA[currentProductId] || PRODUCT_TIMELINE_DATA.workshops;
        const totalSteps = data.steps.length;

        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX > 0 && currentStepIndex < totalSteps - 1) {
            goToStep(currentStepIndex + 1);
          } else if (diffX < 0 && currentStepIndex > 0) {
            goToStep(currentStepIndex - 1);
          }
        } else if (Math.abs(diffY) > 50 && Math.abs(diffY) > Math.abs(diffX)) {
          if (diffY > 0 && currentStepIndex < totalSteps - 1) {
            goToStep(currentStepIndex + 1);
          } else if (diffY < 0 && currentStepIndex > 0) {
            goToStep(currentStepIndex - 1);
          }
        }
      }
    }, { passive: true });

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
