# PROJECT STATUS: lukasz.poruszek.pl
**Ostatnia aktualizacja:** 2026-11-05 (Wdrożenie strony „W przebudowie” z wbudowanym widżetem rezerwacji i warsztatów)
**Architektura:** Lekki interfejs Dark Luxury / Pioneer Monochromatic + Bezpośredni moduł rezerwacji (Cal.com / Cloudflare Workers API)

---

## 0. Tryb awaryjny / Strona w przebudowie (PROD Ready)
- [x] **Kopia zapasowa 3D WebGL:** Pełny kod silnika 3D z Three.js, modelami i shaderami zabezpieczony w [`index.3d.html`](file:///home/poruszek/lukasz.poruszek.pl/index.3d.html) oraz `index.html.full-3d-backup`.
- [x] **Nowa strona główna (`index.html`):**
  - Lekka, błyskawicznie ładująca się strona z oficjalnym komunikatem *„Nowa odsłona serwisu już wkrótce.”* oraz statusem *„STRONA W PRZEBUDOWIE”*.
  - Zachowana pełna estetyka Pioneer/Resn (obsydianowe tło, subtelny radial glow, typografia systemowa wysokiej czytelności).
  - W 100% zintegrowany, wbudowany bezpośrednio gotowy moduł rezerwacji i zapisów:
    1. **Mentoring biznesowy (1:1):** kalendarz z wykupionymi terminami na listopad 2026 i formularz listy rezerwowej z notatką (`/api/waitlist` -> Cal.com).
    2. **Mentoring kariery (1:1):** analogiczna obsługa terminów i listy rezerwowej.
    3. **Warsztaty AI (Grupa grudniowa):** pełny harmonogram 6 spotkań + formularz rezerwacji miejsca (`/api/reserve-workshop` -> Cal.com).
  - Brak jakichkolwiek modyfikacji w kodzie silnika widżetu ([`booking-widget.js`](file:///home/poruszek/lukasz.poruszek.pl/booking-widget.js)) i stylach bazowych ([`booking-widget.css`](file:///home/poruszek/lukasz.poruszek.pl/booking-widget.css)).
  - Zweryfikowano działanie i responsywność na Desktopie (1440px) i Mobile (390px) za pomocą Chrome DevTools.

---

## 1. Stan Silnika 3D (Projekt Docelowy - w `index.3d.html`)
- [x] **Hero / Landing (Akt 0):** Tytuł *„Nie błądź samotnie.”*, 3D artefakt pięściaka (Acheulean stone axe), polskie znaki diakrytyczne w atlasach fontów BMFont MSDF (Manifold & Gilroy).
- [x] **Scena 1 / DNA (Akt 1.1):** *„Podłącz zbiorowy mózg.”*, rotujący widżet orbitalny *„ZAPISZ SIĘ NA WARSZTATY”*.
- [x] **Scena 2 / Data (Akt 1.2 – „Przejmij klocki. Buduj swoje.”):** 
  - Wdrożenie surowej estetyki Pioneer/Resn (brak kart SaaS, gradientowych ramek czy sztucznych pudełek).
  - **Lewa kolumna:** Monumentalny nagłówek *„PRZEJMIJ KLOCKI. BUDUJ SWOJE.”* (`clamp(44px, 4.4vw, 80px)`), intro oraz 3 interaktywne pozycje (Warsztaty AI, Mentoring Biznesowy, Mentoring Kariery) z kinetycznym podświetleniem.
  - **Prawa kolumna:** Tytuł formatu o monumentalnej skali identycznej jak lewy nagłówek, oczyszczona metryka bez cen (wyłącznie czas i forma: *„6 TYGODNI (6X 2H) · KAMERALNA GRUPA”*, *„SESJA 90 MINUT · SPOTKANIE ONLINE”*), 2-akapitowy opis merytoryczny oraz kultowy okrągły widżet orbitalny umieszczony pod tekstem po prawej stronie sekcji (`align-self: flex-end`).
  - **Bezpośrednia nawigacja do kalendarza:** Kliknięcie w okrągły widżet płynnie przewija do Sceny 1 (DNA snap) i natychmiast aktywuje widok kalendarza rezerwacji (`hotspotDna = true`).
  - **Czystość kodu:** Całkowite usunięcie okien modalnych i osobnych podstron. Pełna spójność z Three.js i brak zakłóceń wydajnościowych.

- [x] **Scena 3 / Krystaliczna Macierz (Akt 1.3 – Dawna doniczka):**
  - Całkowite zastąpienie modelu doniczki i kiełkującej kukurydzy zaawansowaną macierzą krystaliczną **Prism Stone** (`models/prism/prism.gltf`).
  - Scalona tekstura 1024x1024 (`prism_combined.jpg`): ciemny łupek grafitowy z cyjanowo-turkusowymi pęknięciami energii.
  - Pełna izolacja sceny 3D: ścisła bramka widoczności (`sceneWrapper.visible = false` poza zakresem `[0, 1]`) eliminująca zakłócanie Sceny 1 (DNA) i Sceny 2 (Klocki/Produkty).
  - Choreografia scrolla: płynna wieloosiowa rotacja monolitu, kaskadowe zbieganie się 4 satelitarnych odłamków ze spiralnych orbit do zwartej konstelacji (promień maks. 1.6 j.).
  - Kinetyka czasu rzeczywistego: sprężysty parallax żyroskopowy myszy (3D tilt), impuls rotacji z pędu scrolla i akceleracja orbity na hoverze.
  - Zero świateł globalnych (MeshBasicMaterial) gwarantujące 120 FPS i stabilność wizualną.

- [x] **Okrojenie mockupu (Blokada Chapter 2 i Chapter 3):**
  - Wyłączenie wyświetlania i ładowania niegotowych rozdziałów (Chapter 2: Real World Testing – Stalk & Field; Chapter 3: Result – Kernel) w ramach przygotowania szybkiego mockupu.
  - Kod i zasoby pozostały w repozytorium (brak usuwania kodu), sekcje zostały wyizolowane i odfiltrowane w `loader.js`, nawigacji orbitalnej `SideNav` (`main.js`) oraz w stylach menu (`products-view.css`).
  - Rozwiązanie problemu zawieszania się preloadera na 100%. Doświadczenie skupione w 100% na Hero i Chapter 1 (Akt 0, Akt 1.1 DNA, Akt 1.2 Data/Produkty).

---

## 2. Rejestr Usług i Cen (Baza Wiedzy)
1. **Warsztaty Orkiestracji AI:** 1200 zł | 6 tygodni (6x 2h) | małe grupy (8–15 os.)
2. **Mentoring Biznesowy:** 400 zł | sesja 90 minut 1:1 | diagnoza i walidacja modeli
3. **Mentoring Kariery:** 300 zł | sesja 90 minut 1:1 | audyt CV/LinkedIn i strategia rekrutacyjna

---

## 3. Najbliższe Zadania (Next Actions)
1. Dostosowanie narracji i copy dla Sceny 3 (nagłówek Manifold + akapit Gilroy) w nawiązaniu do krystalizacji wiedzy / architektury AI.
2. Dalsze przygotowanie mockupu wedle wytycznych użytkownika.
3. Weryfikacja responsywności na urządzeniach mobilnych.
