# Status Projektu: lukasz.poruszek.pl
Ostatnia aktualizacja: **2026-11-03 20:12**  
Aktualna faza: **Faza 2 -> Faza 3: Architektura Informacji, Design System & Brief Zdjęciowy**  
Główny cel: **Strona internetowa personal brandingu w estetyce Awwwards / Byholm / Noomo: warsztaty orkiestracji (6 tyg., 1200 zł) + doraźny mentoring 90 min (biznes: 400 zł, kariera: 300 zł) z bezpośrednią płatnością mBank PayNow**

---

## ⚡ PROTOKÓŁ DLA NOWEGO OKNA KONTEKSTOWEGO
Jeśli otwierasz nowe okno kontekstowe w Antigravity, wyślij poniższy prompt:
```text
Kontynuujemy prace nad projektem lukasz.poruszek.pl. 
Zapoznaj się z plikiem PROJECT_STATUS.md oraz katalogiem docs/, 
podsumuj aktualny stan prac i przejdźmy do realizacji kolejnego zadania z listy Next Actions.
```
**Zasady dla Agenta:**
1. Zawsze przeczytaj ten plik przed podjęciem jakichkolwiek działań.
2. Po wykonaniu znaczącej pracy zaktualizuj sekcje: *Aktualny Stan*, *Najbliższe Zadania (Next Actions)* oraz *Dziennik Zdarzeń (Action Log)*.
3. Przestrzegaj globalnych reguł użytkownika (m.in. zakaz samowolnego `git push` do zdalnego repo, brak nieautoryzowanych DML/DDL, ochrona GCP/Firebase).

---

## 🗺️ Mapa Drogowa Projektu (Roadmap)

| Faza | Nazwa Fazy | Status | Opis |
| :--- | :--- | :--- | :--- |
| **Faza 1** | **Strategiczne Odkrywanie & Baza 100 Pytań** | 🟢 **ZAKOŃCZONA** | Wszystkie 100 pytań sfinalizowane, wyczyszczone z klisz, zdefiniowany cennik i reguły Anti-Bloat. |
| **Faza 2** | **Synteza Strategii, Oferty i Myśli Przewodniej** | 🟢 **ZAKOŃCZONA** | Ustanowiono myśl przewodnią opartą na transferze wiedzy i ekonomii czasu (`docs/NARRACJA_I_MYSL_PRZEWODNIA.md`). |
| **Faza 3** | **Architektura Informacji, Layout & Brief Zdjęciowy** | 🟡 **W TRAKCIE** | Przygotowano brief zdjęciowy (`docs/BRIEF_ZDJECIOWY.md`) pod styl Byholm / Noomo; projekt struktury komponentów. |
| **Faza 4** | **Setup Techniczny & Design System (Astro + Lenis)** | ⚪ Oczekuje | Inicjalizacja Astro + Tailwind v4 + Lenis (smooth scroll) + animacje edytorskie. |
| **Faza 5** | **Implementacja Komponentów & RWD** | ⚪ Oczekuje | Hero z manifestem, klocki 3 usług (1200 zł / 400 zł / 300 zł), sekcja O mnie, interaktywny kalendarz. |
| **Faza 6** | **Integracja Płatności i Fakturowania** | ⚪ Oczekuje | Podpięcie mBank PayNow (BLIK/PBL) + automatyczne fakturowanie + Brevo. |
| **Faza 7** | **Optymalizacja, SEO i Aspekty Prawne** | ⚪ Oczekuje | Dane Polska Grupa Proptech Sp. z o.o., regulamin, privacy-first (zero banera cookies). |
| **Faza 8** | **Wdrożenie Produkcyjne (Deployment)** | ⚪ Oczekuje | Cloudflare Pages, rekordy DNS dla `lukasz.poruszek.pl`, testy transakcyjne na żywo. |

---

## 📊 Kluczowe Decyzje Techniczne i Estetyczne (Stan na 03.11)
- **Wzorce wizualne (Awwwards-tier):** `byholm.co` (surowy, bezkompromisowy minimalizm edytorski, dominująca typografia, perfekcyjny grid), `noomoagency.com` (nowoczesny dark mode, kinetyczna płynność), `cornrevolution.resn.global` (unikalna tożsamość i interakcja).
- **Zasada wizualna:** **ŻADNYCH AI SLOP**. Autorskie fotografie wykonane według dedykowanego briefu (`docs/BRIEF_ZDJECIOWY.md`).
- **Stack technologiczny:** **Astro** (SSG, zero bloatu) + **Tailwind CSS v4** + **Lenis** (kinetyczny smooth scroll) + **GSAP / Motion** + izolowane wyspy Astro dla płatności i kalendarza.
- **Hosting:** **Cloudflare Pages** (domyślnie, global edge CDN).
- **Procesor płatności:** **mBank PayNow** (BLIK, Pay-By-Link, karty).
- **Firma:** **Polska Grupa Proptech Sp. z o.o.**

---

## 🎯 Najbliższe Zadania (Next Actions)
1. **Zdjęcia:** Łukasz organizuje 3–4 ujęcia wg [`docs/BRIEF_ZDJECIOWY.md`](file:///home/poruszek/lukasz.poruszek.pl/docs/BRIEF_ZDJECIOWY.md).
2. **Inicjalizacja projektu (Faza 4):** Utworzenie projektu Astro z Tailwind v4 i konfiguracją Lenis smooth scroll w katalogu `/home/poruszek/lukasz.poruszek.pl`.
3. **Makieta kodu:** Zakodowanie surowego layoutu w duchu Byholm z miejscem na zdjęcia, mocną typografię i klocki zakupowe PayNow.

---

## 📝 Dziennik Zdarzeń (Action Log)
- **2026-11-03 (20:12):**
  - Wdrożono inspiracje wizualne: Noomo, Resn, Byholm.
  - Wdrożono zakaz „AI Slop” (Q85).
  - Przygotowano profesjonalny brief zdjęciowy (`docs/BRIEF_ZDJECIOWY.md`) z podziałem na 4 kadry (Hero, Focus, Dialog, Detal).
  - Dobrano stack technologiczny: Astro + Tailwind v4 + Lenis + Motion pod standard Awwwards.
  - Zdefiniowano Cloudflare Pages (Q88) oraz dane firmy Polska Grupa Proptech Sp. z o.o. (Q91).
  - Zarejestrowano ADR-007 w `docs/02_DECISION_LOG.md`.
