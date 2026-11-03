# Status Projektu: lukasz.poruszek.pl
Ostatnia aktualizacja: **2026-11-03 15:10**  
Aktualna faza: **Faza 1 -> Faza 2: Synteza Strategii, Oferty i Pozycjonowania (B2C-First)**  
Główny cel: **Strona internetowa personal brandingu: warsztaty AI (6-tyg. cykl Antigravity) + doraźny mentoring 90 min (biznes & kariera) w modelu bezpośredniej sprzedaży online**

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
| **Faza 1** | **Strategiczne Odkrywanie & Baza 100 Pytań** | 🟢 **ZAKOŃCZONA** | Wdrożono precyzyjne wytyczne Łukasza (zwrot na B2C-First, 6-tyg. warsztaty Antigravity za 1200 zł, sesje 90 min bez pakietów). |
| **Faza 2** | **Synteza Strategii, Oferty i Pozycjonowania** | 🟡 **W TRAKCIE** | Dostosowanie modułów 5–10 w `docs/01_PYTANIA_STRATEGICZNE_100.md`, przygotowanie cennika i architektury samoobsługowej. |
| **Faza 3** | **Architektura Informacji i Copywriting** | ⚪ Oczekuje | Opracowanie struktury podstron (sitemap), perswazyjnych tekstów B2C i checkoutu (`docs/04_COPYWRITING_I_TRESCI.md`). |
| **Faza 4** | **Setup Techniczny & Design System** | ⚪ Oczekuje | Inicjalizacja projektu (Astro + Tailwind CSS / UI), interaktywny kalendarz, dark/light mode. |
| **Faza 5** | **Implementacja Komponentów & RWD** | ⚪ Oczekuje | Budowa sekcji Hero, Warsztatów AI (z kodem rabatowym), Mentoringu (kalendarz + płatność), O Mnie, FAQ. |
| **Faza 6** | **Integracje (Płatności, Kalendarz, Kody Rabatowe)** | ⚪ Oczekuje | Podpięcie bramki płatności (BLIK / karty), Cal.com/Calendly, fakturowania. |
| **Faza 7** | **Optymalizacja, SEO, WCAG i Aspekty Prawne** | ⚪ Oczekuje | Metadata, Open Graph, schema.org, regulamin sklepu/świadczenia usług, RODO. |
| **Faza 8** | **Wdrożenie Produkcyjne (Deployment)** | ⚪ Oczekuje | Podpięcie domeny `lukasz.poruszek.pl` (Cloudflare Pages), testy transakcyjne na żywo. |

---

## 📊 Aktualny Stan Bazy Pytań (Faza 1)
Plik źródłowy: [`docs/01_PYTANIA_STRATEGICZNE_100.md`](file:///home/poruszek/lukasz.poruszek.pl/docs/01_PYTANIA_STRATEGICZNE_100.md)

- [x] Moduł 1: Pozycjonowanie, Personal Branding i Wiarygodność (Pytania 1–10) – **Dostosowane pod B2C**
- [x] Moduł 2: Oferta – Warsztaty AI (Pytania 11–20) – **Wdrożono dosłowne wytyczne Łukasza (6 tyg., Antigravity, 1200 zł, kody do 0 zł)**
- [x] Moduł 3: Oferta – Mentoring Biznesowy (Pytania 21–30) – **Wdrożono dosłowne wytyczne Łukasza (sesje 90 min, rozbijanie fałszywych stałych, bez sprintów)**
- [x] Moduł 4: Oferta – Mentoring Kariery (Pytania 31–40) – **Wdrożono dosłowne wytyczne Łukasza (sesje 90 min, sterowanie rozmową, bez mocków, bez AI)**
- [x] Moduły 5–10: Zaproponowano spójne, zaktualizowane brzmienie odzwierciedlające zwrot B2C i model bezpośrednich płatności online.

---

## 🎯 Najbliższe Zadania (Next Actions)
1. **Przegląd przez Łukasza:** Weryfikacja zaproponowanych odpowiedzi dla Modułu 5 (Model biznesowy, cennik, proces sprzedaży) i kolejnych.
2. **Potwierdzenie stawki za sesję 90 min:** Ustalenie ceny pojedynczej sesji mentoringowej (np. 400–500 zł).
3. **Faza 3 & 4 – Przygotowanie szkieletu i komponentów Astro + Tailwind:** Implementacja kafelków 3 usług, formularza z kodem rabatowym i kalendarza ze slotami.

---

## 📝 Dziennik Zdarzeń (Action Log)
- **2026-11-03 (15:10):**
  - Wdrożono feedback Łukasza: pełny zwrot z narracji B2B na B2C First.
  - Zaktualizowano program i wycenę Warsztatów AI (6 tygodni, ekosystem Antigravity, wymóg Gemini Pro/Ultra, 1200 zł + kody promocyjne do 0 zł).
  - Przebudowano koncepcję Mentoringu: pojedyncze sesje 90 min (doraźna pomoc, rozbijanie fałszywych stałych, sterowanie rozmową kwalifikacyjną, bez AI i bez mock interviews).
  - Zaproponowano odświeżone odpowiedzi dla pytań 41–100 zorientowane na bezpośredni zakup i automatyczny checkout.
  - Zarejestrowano decyzję ADR-004 w `docs/02_DECISION_LOG.md`.
