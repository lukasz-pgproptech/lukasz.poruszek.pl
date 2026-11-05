# Rejestr Decyzji Projektowych (ADR & Business Decisions)
Projekt: **lukasz.poruszek.pl**

Ten plik rejestruje wszystkie kluczowe decyzje technologiczne, architektoniczne i biznesowe podjęte podczas budowy projektu, aby żadne ustalenie nie zostało zapomniane w kolejnych oknach kontekstowych.

---

## Format wpisu:
- **ID:** ADR-XXX
- **Data:** RRRR-MM-DD
- **Temat:** Krótki tytuł
- **Status:** Proponowane / Zaakceptowane / Zastąpione
- **Kontekst:** Dlaczego podejmowaliśmy tę decyzję?
- **Decyzja:** Co zostało wybrane?
- **Konsekwencje:** Jakie są plusy i minusy?

---

### ADR-001: Wdrożenie Protokołu Ciągłości Wielu Okien Kontekstowych
- **Data:** 2026-11-02
- **Status:** Zaakceptowane
- **Kontekst:** Projekt będzie realizowany przez asystenta AI w wielu niezależnych oknach kontekstowych. Wymagany jest mechanizm gwarantujący bezstratny transfer wiedzy.
- **Decyzja:** Ustanowienie pliku `PROJECT_STATUS.md` jako jedynego źródła prawdy stanu projektu, wspieranego przez bazę pytań w `docs/01_PYTANIA_STRATEGICZNE_100.md` oraz lokalne wersjonowanie Git.
- **Konsekwencje:** Każde nowe okno kontekstowe rozpoczyna pracę od odczytania `PROJECT_STATUS.md` i nie gubi wypracowanych wniosków.

### ADR-002: Metodologia Discovery – 100 Pytań Strategicznych
- **Data:** 2026-11-02
- **Status:** Zaakceptowane
- **Kontekst:** Przed rozpoczęciem pisania kodu i szablonów graficznych konieczne jest precyzyjne zrozumienie oferty komercyjnych warsztatów AI oraz dwóch ścieżek mentoringowych (biznes / kariera).
- **Decyzja:** Opracowanie 100 pytań strategicznych podzielonych na 10 modułów tematycznych w pliku `docs/01_PYTANIA_STRATEGICZNE_100.md`.
- **Konsekwencje:** Użytkownik ma pełną mapę zagadnień do uzupełnienia, a odpowiedzi posłużą jako wsad do copywritingu, architektury i logiki biznesowej strony.

### ADR-003: Wykorzystanie Centralnej Bazy Wiedzy Łukasza jako Źródła Faktów
- **Data:** 2026-11-03
- **Status:** Zaakceptowane
- **Kontekst:** Użytkownik posiada zorganizowaną bazę wiedzy w katalogu `/home/poruszek/Łukasz informacje` z opisem kariery, profilu, case studies, konspektu warsztatów i filozofii pracy.
- **Decyzja:** Pobrano fakty z centralnej bazy i wypełniono bazę 100 pytań strategicznych w `docs/01_PYTANIA_STRATEGICZNE_100.md`.
- **Konsekwencje:** Zaoszczędzono czas użytkownika; odpowiedzi odzwierciedlają autentyczne doświadczenia inżynieryjne i biznesowe (PARP, ResiCraft, Motzny, Dzielna 64, Grupa Zero).

### ADR-004: Zwrot Strategiczny: Prymat Klienta Indywidualnego (B2C First) & Model Samoobsługowy
- **Data:** 2026-11-03
- **Status:** Zaakceptowane
- **Kontekst:** Wstępne założenia błędnie kładły nacisk na korporacyjne B2B i długie procesy discovery calli. Łukasz sprecyzował, że głównym odbiorcą jest **klient indywidualny (B2C)**, a oferta dla firm to opcja dodatkowa dla większych grup.
- **Decyzja:**
  1. **Warsztaty AI:** 6-tygodniowy cykl online (6x 2h) w ekosystemie Antigravity z ekstrapolacją na rynek, 1200 zł cena bazowa z obsługą kodów rabatowych (do 0 zł), pokoje wymiany wiedzy, prace domowe i sesje 1:1.
  2. **Mentoring (Biznes i Kariera):** Pojedyncze sesje 90 min doraźnej diagnozy (brak pakietów/sprintów). W karierze brak AI i brak mock interviews (nauka sterowania rozmową na własne tory).
  3. **Sprzedaż & UX:** W 100% samoobsługowa – jawne ceny na stronie, wybór terminu w kalendarzu, formularz i natychmiastowa płatność online.
- **Konsekwencje:** Drastyczne uproszczenie lejka, wysoka przejrzystość strony, zautomatyzowana konwersja.

### ADR-005: Wybór Bramki Płatności mBank PayNow & Automatyzacja Fakturowania
- **Data:** 2026-11-03
- **Status:** Zaakceptowane
- **Kontekst:** Potrzebna jest niezawodna, polska bramka obsługująca natychmiastowe płatności (BLIK, PBL, karty) zintegrowana z kontem firmowym w mBanku oraz zautomatyzowane fakturowanie.
- **Decyzja:** Wybrano **mBank PayNow**. Fakturowanie zintegrowane poprzez mOrganizer Finansów mBanku lub bezpośrednie API fakturowni generujące faktury imienne (B2C) i faktury VAT (B2B z obsługą KSeF).
- **Konsekwencje:** Niskie prowizje, bezpośrednie księgowanie na rachunku w mBanku, natychmiastowa wysyłka PDF z fakturą do klienta.

### ADR-006: Zasada Radykalnego Minimalizmu Treściowego (Anti-Bloat)
- **Data:** 2026-11-03
- **Status:** Zaakceptowane
- **Kontekst:** Strony szkoleniowe często toną w marketingowym szumie: sztucznych licznikach ("1000+ absolwentów"), ścianach case studies, logotypach i lead magnetach, których nikt nie czyta.
- **Decyzja:** 
  1. Całkowita rezygnacja z bloga/artykułów na stronie.
  2. Całkowita rezygnacja z osobnej sekcji Case Studies (konkretne doświadczenie wplecione w zwięzłe bio).
  3. Zero podpierania się logami marek i zero sztucznych liczników/counterów.
  4. Czysty, lekki interfejs: 3 jasne oferty z bezpośrednią możliwością zakupu/rezerwacji terminu.
- **Konsekwencje:** Błyskawiczny czas ładowania strony, maksymalny współczynnik konwersji, brak wrażenia "przeładowania", wysoki szacunek do czasu użytkownika.


### ADR-007: Kierunek Wizualny Awwwards-Tier (Noomo / Byholm / Resn) & Stack Technologiczny
- **Data:** 2026-11-03
- **Status:** Zaakceptowane
- **Kontekst:** Łukasz wskazał jako bezpośrednie wzorce estetyczne serwisy światowej klasy designerskiej: `noomoagency.com`, `byholm.co` oraz `cornrevolution.resn.global`. Wymóg: **Zero AI Slop**, rygorystyczny minimalizm edytorski, mocna typografia, kinetyczne mikroanimacje i autorskie zdjęcia wg dedykowanego briefu.
- **Decyzja:** 
  1. **Stack:** **Astro** (ultraszybki silnik SSG, zerowy bloat JS) + **Tailwind CSS v4** + **Lenis** (organiczny, kinetyczny smooth scroll) + **GSAP / Motion** (subtelne reveal-on-scroll animacje).
  2. **Interakcje:** Komponenty rezerwacji i płatności PayNow osadzone jako wyspy Astro (Astro Islands).
  3. **Hosting:** Cloudflare Pages (domyślnie, global edge CDN).
  4. **Fotografia:** Wdrożenie profesjonalnego briefu artystycznego (`docs/BRIEF_ZDJECIOWY.md`) z podziałem na 4 ujęcia (Hero, Focus/Work, Dialog/Partnerstwo, Detal).
- **Konsekwencje:** Strona uzyskuje unikalny, luksusowo-inżynierski charakter (jak portfolio Byholma i Noomo), wyróżniając się drastycznie na tle typowych polskich stron szkoleniowych, zachowując 100/100 punktów w Google Lighthouse.


### ADR-008: Wdrożenie Skilli /awwwards oraz /jury (Standard Awwwards Site of the Day)
- **Data:** 2026-11-03
- **Status:** Zaakceptowane
- **Kontekst:** Łukasz zidentyfikował i wskazał wyspecjalizowane skille agentowe: `/awwwards` oraz `/jury` (autorstwa `juliobsz/skills`).
- **Decyzja:** 
  1. Zainstalowano skille globalnie (`~/.gemini/config/skills/`) oraz lokalnie w projekcie (`.agents/skills/`).
  2. Skill `/awwwards` dostarcza zoptymalizowany dla Astro silnik ruchu (Astro ClientRouter + Lenis + GSAP, waga zaledwie ~75 KB), wolne od AI-slop schematy typograficzne i zasady kompozycji plakatowej (każda klatka jako plakat).
  3. Skill `/jury` realizuje bezstronny audyt jakościowy: wykonuje zrzuty ekranu w headless Chromium (Playwright), mierzy LCP/CLS na dławionym łączu mobilnym, audytuje dostępność (axe-core) i wystawia kartę ocen wg kryteriów Awwwards.
- **Konsekwencje:** Pełna automatyzacja dowożenia jakości Awwwards-tier bez kompromisów wydajnościowych.

### ADR-009: Interaktywny Selektor 3 Produktów i Dynamiczny Panel Glassmorphism (Scena 2)
- **Data:** 2026-11-05
- **Status:** Zaakceptowane i Wdrożone
- **Kontekst:** W widoku Sceny 2 („Computers cut down the contenders”) brakowało prezentacji 3 kluczowych produktów Łukasza oraz znikał widżet zapisów widoczny w Scenie 1.
- **Decyzja:** 
  1. **Typografia WebGL:** Zaktualizowano nagłówek 3D na `PRZEJMIJ KLOCKI. BUDUJ SWOJE.` oraz intro `Zamiast tracić miesiące na wyważanie otwartych drzwi, wybierz sprawdzoną dźwignię:`. Zoptymalizowano pozycję pionową w scenie WebGL (+140 jednostek), aby stworzyć ergonomiczną przestrzeń pod selektor.
  2. **Interaktywny Selektor (Lewa Kolumna):** Wdrożono 3 klikalne karty produktowe (01 Warsztaty AI, 02 Mentoring Biznesowy, 03 Mentoring Kariery) z podświetleniem aktywnego wyboru w szmaragdowym akcencie `#00e599`.
  3. **Dynamiczny Panel Glassmorphism (Prawa Kolumna):** Luksusowe okno ze szkła akrylowego (`backdrop-filter: blur(28px) saturate(180%)`), prezentujące kicker, tytuł, badge z ceną/czasem, punktorowany opis oraz dedykowany widżet CTA (`ZAPISZ SIĘ NA WARSZTATY` / `ZAREZERWUJ TERMIN SESJI`).
  4. **Synchronizacja i Modal:** Stan widoczności powiązany z silnikiem scrolla i hookami `onActive` / `offActive` Sceny 2 (`data`). Kliknięcie w CTA uruchamia dopasowany modal z podsumowaniem i opcją natychmiastowego przejścia.
- **Konsekwencje:** Widok Sceny 2 stał się w pełni interaktywnym, konwertującym katalogiem usług o jakości Awwwards SOTD, płynnie zintegrowanym z trójwymiarową chmurą cząsteczek.

### ADR-010: Redesign Sceny 2 wg Estetyki Pioneer/Resn z Kinetycznym Widżetem Orbitalnym
- **Data:** 2026-11-05
- **Status:** Zaakceptowane i Wdrożone
- **Kontekst:** Poprzednia wersja panelu w Scenie 2 wprowadzała zbyt dużo elementów typu SaaS (karty, kafelki, ramki), co zaburzało spójność ze surowym, kinetycznym stylem Pioneer / Resn. Ponadto widżet zapisu znikał w Scenie 2 lub był umieszczony w nieoptymalnej relacji przestrzennej.
- **Decyzja:** 
  1. **Redukcja szumu wizualnego:** Usunięto sztuczne karty z gradientami, numerację 01/02/03, kickery i etykiety selektora. Zastosowano surową, edytorską typografię Manifold & Gilroy bezpośrednio wkomponowaną w przestrzeń 3D cząsteczek.
  2. **Harmonia monumentalnych tytułów:** Tytuły formatów po prawej stronie (*„ORKIESTRACJA SYSTEMÓW AI”*, *„DIAGNOZA BIZNESOWA I WALIDACJA”*, *„STRATEGIA I NAWIGACJA REKRUTACYJNA”*) otrzymały dokładnie taką samą monumentalną skalę (`clamp(44px, 4.4vw, 80px)`) jak nagłówek po lewej (*„PRZEJMIJ KLOCKI. BUDUJ SWOJE.”*).
  3. **Kinetyczny widżet orbitalny:** Zastosowano kultowy okrągły widżet orbitalny (1:1 jak w Scenie 1) z obracającym się pierścieniem i szklanym dyskiem, umieszczony pod tekstem po prawej stronie prawej sekcji (`align-self: flex-end; margin-top: 10px;`). Nie koliduje on ze wskaźnikiem rozdziału *SCIENCE*.
  4. **Podwójna synchronizacja Three.js + Scroll:** Połączono aktywację bezpośrednio z hookami `onActive` / `offActive` sekcji `data` w `main.js` oraz zapasowym mechanizmem pozycji scrolla. Zdublowane obiekty tekstu 3D w WebGL są automatycznie ukrywane (`visible = false`).
- **Konsekwencje:** Pełna spójność wizualna i kinetyczna ze standardem Awwwards SOTD / Resn, z zachowaniem konwertującego CTA na każdym z 3 produktów.

### ADR-011: Usunięcie Kwot ze Sceny 2 i Bezpośrednia Nawigacja Widżetu do Kalendarza DNA
- **Data:** 2026-11-05
- **Status:** Zaakceptowane i Wdrożone
- **Kontekst:** Na prośbę użytkownika zrezygnowano z wyświetlania cen przy produktach w Scenie 2, aby utrzymać surowy, bezkompromisowy ton edytorski. Jednocześnie zrezygnowano z modalnych popupów i osobnych podstron – kliknięcie w okrągły widżet orbitalny ma kierować dokładnie w to samo miejsce, co widżet ze Sceny 1 (widok kalendarza rezerwacji).
- **Decyzja:** 
  1. **Usunięcie cen z metryk:** Oczyszczono metryki produktów z kwot (`1200 ZŁ`, `400 ZŁ`, `300 ZŁ`). Pozostawiono precyzyjny wymiar czasu i formy (`6 TYGODNI (6X 2H) · KAMERALNA GRUPA` oraz `SESJA 90 MINUT · SPOTKANIE ONLINE`).
  2. **Likwidacja modali i zbędnych podstron:** Skasowano plik `mockup-warsztaty.html` oraz usunięto strukturę HTML i style CSS modalu `#product-modal-backdrop`.
  3. **Bezpośrednie przekierowanie do widoku kalendarza (Hotspot DNA):** Kliknięcie w `#circularWidget` wykonuje `goToCalendarView()` – płynne przewinięcie na pozycję snapu `science/dna` oraz aktywację natywnego stanu Three.js `window.appStore.state.navigation.hotspotDna = true`.
- **Konsekwencje:** Jednolity, intuicyjny lejek użytkownika – każdy widżet prowadzi do tego samego, centralnego widoku rezerwacji, a strona zyskuje jeszcze czystszy, luksusowy charakter pozbawiony szumu cenowego.
