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
          shortTitle: 'PROMPTING',
          tag: 'KROK 01 / 06 · FUNDAMENTY I PROMPTING',
          heading: 'Fundamenty LLM i precyzyjny prompting',
          paragraphs: [
            'Pod maską LLM: okno kontekstu, tokenizacja i mechanizm powstawania halucynacji.',
            'Techniki precyzyjnego sterowania modelem oraz eliminacja losowości w powtarzalnych zadaniach biznesowych.',
            'Efektywny warsztat codziennej pracy z asystentem AI bezpośrednio w przeglądarce (Gemini Web).'
          ]
        },
        {
          num: '02',
          shortTitle: 'PLIKI W IDE',
          tag: 'KROK 02 / 06 · PRACA NA PLIKACH',
          heading: 'Praca z agentami na plikach w IDE',
          paragraphs: [
            'Dlaczego okno czatu to wąskie gardło i czym w praktyce różni się zwykły model od autonomicznego Agenta.',
            'Pierwsze uruchomienie i bezstresowa konfiguracja profesjonalnego środowiska pracy (IDE).',
            'Bezpieczne czytanie, analiza i automatyczna edycja lokalnych dokumentów, arkuszy oraz baz wiedzy.'
          ]
        },
        {
          num: '03',
          shortTitle: 'AGENTS.MD',
          tag: 'KROK 03 / 06 · BAZA REGUŁ',
          heading: 'Baza reguł i workflow (agents.md)',
          paragraphs: [
            'Koniec z powtarzaniem tych samych instrukcji i kontekstu przy każdej nowej rozmowie.',
            'Architektura pliku zasad (agents.md): jak skutecznie uczyć model Twoich reguł biznesowych.',
            'Standaryzacja procesów i schematów, dzięki którym AI zawsze trzyma się wyznaczonych ram jakościowych.'
          ]
        },
        {
          num: '04',
          shortTitle: 'NARZĘDZIA MCP',
          tag: 'KROK 04 / 06 · NARZĘDZIA MCP',
          heading: 'Narzędzia zewnętrzne i protokół MCP',
          paragraphs: [
            'Czym jest Model Context Protocol (MCP) w prostych, zrozumiałych słowach.',
            'Podłączanie narzędzi zewnętrznych: odczyt baz danych, wyszukiwanie na żywo w sieci oraz integracja z API.',
            'Wyposażenie agenta w cyfrowe ręce do wykonywania realnych zadań operacyjnych w Twoim systemie.'
          ]
        },
        {
          num: '05',
          shortTitle: 'AGENCI',
          tag: 'KROK 05 / 06 · TWORZENIE AGENTÓW',
          heading: 'Tworzenie wyspecjalizowanych agentów',
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
          heading: 'Orkiestracja i cyfrowy zespół',
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
          shortTitle: 'OFERTA',
          tag: 'OBSZAR 01 / 06 · OFERTA I CENNIK',
          heading: 'Audyt oferty i monetyzacji',
          paragraphs: [
            'Szczegółowa analiza struktury przychodów, marżowości oraz dotychczasowego cennika.',
            'Wskazanie miejsc, w których oddajesz marżę lub niepotrzebnie komplikujesz ścieżkę zakupu klientowi.'
          ]
        },
        {
          num: '02',
          shortTitle: 'WALIDACJA',
          tag: 'OBSZAR 02 / 06 · REALITY-CHECK',
          heading: 'Walidacja i rynkowy reality-check',
          paragraphs: [
            'Bezwzględna walidacja założeń biznesowych przed zainwestowaniem oszczędności, budżetu i czasu.',
            'Projekt najprostszego i najtańszego testu rynkowego (MVP / Proof-of-Concept) w realnych warunkach.'
          ]
        },
        {
          num: '03',
          shortTitle: 'WĄSKIE GARDŁA',
          tag: 'OBSZAR 03 / 06 · BLOKADY ROZWOJU',
          heading: 'Diagnoza wąskich gardeł w sprzedaży',
          paragraphs: [
            'Zidentyfikowanie głównej blokady hamującej skalowanie biznesu lub konwersję w lejku sprzedażowym.',
            'Konkretny plan natychmiastowych usprawnień procesowych do wdrożenia w Twojej firmie w 14 dni.'
          ]
        },
        {
          num: '04',
          shortTitle: 'FINANSOWANIE',
          tag: 'OBSZAR 04 / 06 · KAPITAŁ',
          heading: 'Ścieżka finansowania: dotacje vs bootstrap',
          paragraphs: [
            'Dopasowanie realnych źródeł finansowania pod Twój model (granty, B+R, aniołowie biznesu).',
            'Obiektywna ocena ryzyk prawnych i kosztów operacyjnych związanych z pozyskaniem kapitału zewnętrznego.'
          ]
        },
        {
          num: '05',
          shortTitle: 'WDROŻENIE AI',
          tag: 'OBSZAR 05 / 06 · AUTOMATYZACJA',
          heading: 'Automatyzacja i quick-wins z AI',
          paragraphs: [
            'Wskazanie 2–3 powtarzalnych procesów w firmie, które można zautomatyzować narzędziami AI od zaraz.',
            'Dobór sprawdzonych narzędzi agentowych bez konieczności budowy drogich rozwiązań programistycznych.'
          ]
        },
        {
          num: '06',
          shortTitle: 'STRATEGIA',
          tag: 'OBSZAR 06 / 06 · KONSULTACJA DECYZJI',
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
          shortTitle: 'AUDYT CV',
          tag: 'OBSZAR 01 / 06 · AUDYT DOKUMENTÓW',
          heading: 'Audyt CV i profilu LinkedIn',
          paragraphs: [
            'Bezlitosna eliminacja czerwonych flag, lania wody i niewidocznych filtrów automatycznych systemów ATS.',
            'Przepisanie kluczowych osiągnięć zawodowych na twardy język wymiernych rezultatów biznesowych.'
          ]
        },
        {
          num: '02',
          shortTitle: 'POZYCJONOWANIE',
          tag: 'OBSZAR 02 / 06 · POZYCJONOWANIE',
          heading: 'Diagnoza braku odzewu na rynku',
          paragraphs: [
            'Dokładna analiza dotychczasowych wysyłek, dopasowania stanowisk oraz targetowania branż.',
            'Korekta pozycjonowania zawodowego i odnalezienie Twojego unikalnego wyróżnika kompetencyjnego.'
          ]
        },
        {
          num: '03',
          shortTitle: 'MOCK INTERVIEW',
          tag: 'OBSZAR 03 / 06 · SYMULACJA',
          heading: 'Symulacja rozmowy kwalifikacyjnej',
          paragraphs: [
            'Przećwiczenie niewygodnych pytań rekruterów o luki w CV, powody rozstań i trudne projekty.',
            'Nauka techniki przejmowania kontroli nad agendą i sprowadzania rozmowy na własne najmocniejsze tory.'
          ]
        },
        {
          num: '04',
          shortTitle: 'NEGOCJACJE',
          tag: 'OBSZAR 04 / 06 · WYNAGRODZENIE',
          heading: 'Negocjacje stawek i warunków oferty',
          paragraphs: [
            'Określenie realnego pułapu rynkowego dla Twoich umiejętności i wyznaczenie progu minimalnego (Walk-Away Point).',
            'Scenariusze rozmowy o podwyżce lub ofercie końcowej bez ryzyka spalenia mostów.'
          ]
        },
        {
          num: '05',
          shortTitle: 'KOMPETENCJE AI',
          tag: 'OBSZAR 05 / 06 · WYRÓŻNIK',
          heading: 'Kompetencje AI jako wyróżnik',
          paragraphs: [
            'Jak pokazać znajomość narzędzi AI i pracy agentowej jako twardą przewagę rynkową w Twojej roli.',
            'Przekonująca prezentacja projektów z wykorzystaniem AI w portfolio oraz w profilu LinkedIn.'
          ]
        },
        {
          num: '06',
          shortTitle: 'AWANS / PIVOT',
          tag: 'OBSZAR 06 / 06 · ŚCIEŻKA KARIERY',
          heading: 'Reality-check przebranżowienia lub awansu',
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
        '<h3 class="stage-heading">' + step.heading + '</h3>' +
        '<div class="stage-paragraphs">' +
          parasHtml +
        '</div>'
      );
      stageEl.classList.remove('is-changing');
    }, 110);
  }

  let hotspotAnimFrame = null;

  function animateHotspotTo(targetX, targetY, duration = 380) {
    try {
      if (!window.view || !window.view.sections || !window.view.sections[1] || !window.view.sections[1].data) return;
      const hs = window.view.sections[1].data.hotspot;
      if (!hs || !hs.object) return;

      if (hotspotAnimFrame) cancelAnimationFrame(hotspotAnimFrame);

      const startX = hs.object.position.x;
      const startY = hs.object.position.y;
      const startTime = performance.now();

      function step(now) {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const ease = 1 - Math.pow(1 - t, 3);
        hs.object.position.x = startX + (targetX - startX) * ease;
        hs.object.position.y = startY + (targetY - startY) * ease;
        if (t < 1) {
          hotspotAnimFrame = requestAnimationFrame(step);
        }
      }
      hotspotAnimFrame = requestAnimationFrame(step);
    } catch (e) {}
  }

  function updateRoadmapActiveState(stepIndex, totalSteps) {
    const bar = document.getElementById('timelineRoadmapBar');
    if (!bar) return;

    const nodes = bar.querySelectorAll('.roadmap-node');
    let activeNode = null;
    nodes.forEach(function (n, idx) {
      const isActive = idx === stepIndex;
      n.classList.toggle('is-active', isActive);
      n.setAttribute('aria-selected', isActive ? 'true' : 'false');
      if (isActive) activeNode = n;
    });

    const progressEl = bar.querySelector('.roadmap-track-progress');
    const trackEl = bar.querySelector('.roadmap-track-container');
    if (progressEl && trackEl && activeNode) {
      const trackRect = trackEl.getBoundingClientRect();
      const nodeRect = activeNode.getBoundingClientRect();
      const targetWidth = Math.max(0, (nodeRect.left + nodeRect.width / 2) - trackRect.left);
      progressEl.style.width = targetWidth + 'px';
    }
  }

  function renderTimelineRoadmap(productId, initialStepIndex) {
    const data = PRODUCT_TIMELINE_DATA[productId] || PRODUCT_TIMELINE_DATA.workshops;
    const bar = document.getElementById('timelineRoadmapBar');
    if (!bar) return;

    const steps = data.steps;

    const makeNodeHtml = function (s, idx) {
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
    };

    const leftNodesHtml = steps.slice(0, 3).map((s, i) => makeNodeHtml(s, i)).join('');
    const rightNodesHtml = steps.slice(3, 6).map((s, i) => makeNodeHtml(s, i + 3)).join('');

    bar.innerHTML = (
      '<div class="roadmap-track-container">' +
        '<div class="roadmap-track-line"></div>' +
        '<div class="roadmap-track-progress"></div>' +
        '<div class="roadmap-nodes-group">' +
          '<div class="roadmap-nodes-left">' + leftNodesHtml + '</div>' +
          '<div class="roadmap-center-slot"></div>' +
          '<div class="roadmap-nodes-right">' + rightNodesHtml + '</div>' +
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

    setTimeout(() => {
      updateRoadmapActiveState(initialStepIndex, steps.length);
    }, 60);
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
        '<h2 class="timeline-main-title">' + data.title + '</h2>'
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

    if (typeof window.selectProduct === 'function') {
      window.selectProduct(productId, true);
    }

    const container = document.getElementById('products-view-container');
    const deepDive = document.getElementById('product-deep-dive');

    if (container) container.classList.add('is-detail-view');
    if (deepDive) {
      deepDive.classList.add('is-open');
      deepDive.setAttribute('aria-hidden', 'false');
    }

    const logoEl = document.querySelector('.logo');
    if (logoEl) logoEl.classList.add('is-timeline-open');

    const menuBtnEl = document.querySelector('.menuBtn');
    if (menuBtnEl) {
      menuBtnEl.style.display = 'none';
      menuBtnEl.classList.add('is-timeline-open');
    }
    if (window.view && window.view.menuBtn && window.view.menuBtn.object) {
      window.view.menuBtn.object.visible = false;
    }

    try {
      if (window.view && window.view.sections && window.view.sections[1] && window.view.sections[1].data) {
        const s2 = window.view.sections[1].data;
        if (s2.moreHotspot && s2.moreHotspot.hide) s2.moreHotspot.hide({ delay: 0 });
        if (s2.hotspot && s2.hotspot.show) s2.hotspot.show({ delay: 0.1 });

        // Wypchnięcie i powiększenie widżetu 3D (pełna czytelność i wyeksponowanie)
        if (s2.hotspot && s2.hotspot.object) {
          s2.hotspot.object.scale.set(1.25, 1.25, 1.25);
        }

        // Płynny ślizg widżetu 3D do wycentrowanego gniazda osi roadmapy
        const targetY = -245;
        animateHotspotTo(0, targetY, 380);
      }
    } catch (e) {}

    update3DHotspotText(productId);
  };

  window.hideProductDetail = function () {
    window.isDetailViewOpen = false;

    if (typeof window.selectProduct === 'function') {
      window.selectProduct(currentProductId, true);
    }

    const container = document.getElementById('products-view-container');
    const deepDive = document.getElementById('product-deep-dive');

    if (container) container.classList.remove('is-detail-view');
    if (deepDive) {
      deepDive.classList.remove('is-open');
      deepDive.setAttribute('aria-hidden', 'true');
    }

    const logoEl = document.querySelector('.logo');
    if (logoEl) logoEl.classList.remove('is-timeline-open');

    const menuBtnEl = document.querySelector('.menuBtn');
    if (menuBtnEl) {
      menuBtnEl.style.display = '';
      menuBtnEl.classList.remove('is-timeline-open');
    }
    if (window.view && window.view.menuBtn && window.view.menuBtn.object) {
      window.view.menuBtn.object.visible = true;
    }

    // Płynny powrót widżetu 3D do bazowej pozycji w Scenie 2
    try {
      if (window.view && window.view.sections && window.view.sections[1] && window.view.sections[1].data) {
        const s2 = window.view.sections[1].data;
        if (s2.hotspot && s2.hotspot.object) {
          s2.hotspot.object.scale.set(1, 1, 1);
        }
        const origX = 0.32 * (s2.hotspot.props.viewport ? s2.hotspot.props.viewport.width : 1440);
        const origY = -0.27 * (s2.hotspot.props.viewport ? s2.hotspot.props.viewport.height : 900);
        animateHotspotTo(origX, origY, 380);

        if (s2.hotspot && s2.hotspot.show) s2.hotspot.show({ delay: 0.1 });
        if (s2.moreHotspot && s2.moreHotspot.show) s2.moreHotspot.show({ delay: 0.15 });
      }
    } catch (e) {}

    update3DHotspotText(currentProductId);
  };

  // -------------------------------------------------------------
  // NAWIGACJA Z MENU HAMBURGERA DO OSI PRODUKTU / KALENDARZA
  // -------------------------------------------------------------
  window.navigateFromMenu = function (productId) {
    // 1. Zamknij menu hamburgera
    if (window.appStore && window.appStore.state && window.appStore.state.navigation) {
      window.appStore.state.navigation.menu = false;
      window.appStore.state.navigation.hotspotDna = false;
      window.appStore.state.navigation.hotspotStalk = false;
      window.appStore.state.navigation.hotspotKernel = false;
    }

    // 2. Natychmiastowy skok do Sceny 2 w silniku 3D WebGL
    const snap = window.getSnapPos ? window.getSnapPos('science', 'data') : 3906;
    if (window.scrollHandler) {
      if (typeof window.scrollHandler.scrollTo === 'function') {
        window.scrollHandler.scrollTo(snap);
      } else if (window.scrollHandler.position !== undefined) {
        window.scrollHandler.position = snap;
      }
    }
    if (window.appStore && window.appStore.state && window.appStore.state.scroll) {
      window.appStore.state.scroll.position = snap;
    }
    if (typeof window.onSection2Active === 'function') {
      window.onSection2Active();
    }

    // 3. Otwórz widok osi narracyjnej dla wybranego produktu
    window.showProductDetail(productId);
  };

  window.openCalendarFromMenu = function () {
    if (window.appStore && window.appStore.state && window.appStore.state.navigation) {
      window.appStore.state.navigation.menu = false;
    }
    if (typeof window.openBookingModal === 'function') {
      window.openBookingModal('workshops');
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

    function selectProduct(productId, force) {
      if (window.isDetailViewOpen && !force) return;
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
      if (window.isDetailViewOpen) return null;
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
      if (window.isDetailViewOpen) return;
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
        if (window.isDetailViewOpen) return;
        e.preventDefault();
        const pId = item.getAttribute('data-id');
        selectProduct(pId);
      });
      item.addEventListener('mouseenter', () => {
        if (window.isDetailViewOpen) return;
        const pId = item.getAttribute('data-id');
        if (pId && pId !== currentProductId) {
          selectProduct(pId);
        }
      });
      item.addEventListener('mouseover', () => {
        if (window.isDetailViewOpen) return;
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

    window.selectProduct = selectProduct;
    selectProduct('workshops', true);

    // Obsługa kliknięć przycisków w menu hamburgera z fazą przechwytywania (capture)
    function setupHamburgerMenuButtons() {
      document.addEventListener('click', function (e) {
        const target = e.target;
        if (!target || typeof target.closest !== 'function') return;

        const btnSignup = target.closest('[data-ui="btnSignup"]');
        const btnContact = target.closest('[data-ui="btnContact"]');
        const btnLegal = target.closest('[data-ui="btnLegal"]');
        const btnPodcast = target.closest('[data-ui="btnPodcast"]');

        if (btnSignup) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          window.navigateFromMenu('workshops');
        } else if (btnContact) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          window.navigateFromMenu('business');
        } else if (btnLegal) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          window.navigateFromMenu('career');
        } else if (btnPodcast) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          window.openCalendarFromMenu();
        }
      }, true);
    }
    setupHamburgerMenuButtons();
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

      // Trwałe wyłączenie bocznej nawigacji (kropki i kółka po prawej stronie)
      if (window.view && window.view.sideNav) {
        if (window.view.renderer && window.view.renderer.scene && window.view.sideNav.object) {
          window.view.renderer.scene.remove(window.view.sideNav.object);
        }
        if (window.view.sideNav.object) window.view.sideNav.object.visible = false;
        window.view.sideNav.props.v = false;
        window.view.sideNav.props.active = false;
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
