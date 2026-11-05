# PROJECT STATUS: lukasz.poruszek.pl
**Ostatnia aktualizacja:** 2026-11-05 (Finalizacja Sceny 2 w surowej estetyce Pioneer/Resn z orbitalnym widżetem)
**Architektura:** Pioneer Corn Revolution WebGL Engine (Three.js + GLSL + MSDF Fonts) + Kinetic Editorial Brutalism

---

## 1. Aktualny Stan Prac
- [x] **Hero / Landing (Akt 0):** Tytuł *„Nie błądź samotnie.”*, 3D artefakt pięściaka (Acheulean stone axe), polskie znaki diakrytyczne w atlasach fontów BMFont MSDF (Manifold & Gilroy).
- [x] **Scena 1 / DNA (Akt 1.1):** *„Podłącz zbiorowy mózg.”*, rotujący widżet orbitalny *„ZAPISZ SIĘ NA WARSZTATY”*.
- [x] **Scena 2 / Data (Akt 1.2 – „Przejmij klocki. Buduj swoje.”):** 
  - Wdrożenie surowej estetyki Pioneer/Resn (brak kart SaaS, gradientowych ramek czy sztucznych pudełek).
  - **Lewa kolumna:** Monumentalny nagłówek *„PRZEJMIJ KLOCKI. BUDUJ SWOJE.”* (`clamp(44px, 4.4vw, 80px)`), intro oraz 3 interaktywne pozycje (Warsztaty AI, Mentoring Biznesowy, Mentoring Kariery) z kinetycznym podświetleniem.
  - **Prawa kolumna:** Tytuł formatu o monumentalnej skali identycznej jak lewy nagłówek, metryka (cena/czas/forma), 2-akapitowy opis merytoryczny oraz kultowy okrągły widżet orbitalny umieszczony pod tekstem po prawej stronie sekcji (`align-self: flex-end`).
  - Pełna integracja z silnikiem WebGL: ukrycie dublujących się napisów 3D, natychmiastowe przełączanie stanów i obsługa modalu zapisu/rezerwacji.

---

## 2. Rejestr Usług i Cen (Baza Wiedzy)
1. **Warsztaty Orkiestracji AI:** 1200 zł | 6 tygodni (6x 2h) | małe grupy (8–15 os.)
2. **Mentoring Biznesowy:** 400 zł | sesja 90 minut 1:1 | diagnoza i walidacja modeli
3. **Mentoring Kariery:** 300 zł | sesja 90 minut 1:1 | audyt CV/LinkedIn i strategia rekrutacyjna

---

## 3. Najbliższe Zadania (Next Actions)
1. Przegląd i dostosowanie kolejnych scen (Scena 3 / Pot, Scena 4 / Stalk testy stresowe, Scena 6 / Ziarno i finał).
2. Podpięcie bezpośredniego linku do systemu rezerwacji / Cal.com lub formularza w modalu.
3. Weryfikacja responsywności na urządzeniach mobilnych.
