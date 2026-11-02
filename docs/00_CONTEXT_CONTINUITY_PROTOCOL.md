# Protokół Ciągłości Kontekstu (Cross-Context Continuity Protocol)
Projekt: **lukasz.poruszek.pl**

## Cel Protokołu
Gwarancja 100% bezstratnego transferu wiedzy i stanu projektu pomiędzy kolejnymi oknami kontekstowymi AI (sesjami Antigravity). Każde nowe okno kontekstowe natychmiast wie, na jakim etapie jesteśmy, jakie decyzje zapadły, co jest zrobione, a co stanowi najbliższy krok.

---

## 1. Złota Zasada Jednego Źródła Prawdy (Single Source of Truth)
Głównym plikiem sterującym stanem projektu jest:
👉 **`PROJECT_STATUS.md`** w głównym katalogu projektu.

Każde nowe okno kontekstowe w pierwszej kolejności **zawsze odczytuje `PROJECT_STATUS.md`**.

---

## 2. Instrukcja dla Użytkownika – Jak otworzyć nowe okno kontekstowe
Gdy kończy się kontekst lub otwierasz nową sesję, wystarczy, że wkleisz poniższy prompt startowy:

```markdown
Kontynuujemy prace nad projektem lukasz.poruszek.pl. 
Zapoznaj się z plikiem PROJECT_STATUS.md oraz katalogiem docs/, 
podsumuj aktualny stan prac i przejdźmy do realizacji kolejnego zadania z listy Next Actions.
```

---

## 3. Rygor Pracy dla Agenta AI w Każdym Oknie Kontekstowym
1. **Przed rozpoczęciem pracy:**
   - Przeczytaj `PROJECT_STATUS.md`.
   - Zweryfikuj aktualną fazę projektu oraz ostatni wpis w dzienniku zmian (`Action Log`).
2. **W trakcie pracy:**
   - Wszystkie strategiczne decyzje (wybór narzędzi, cenniki, teksty, architektura) zapisuj do odpowiednich plików w `docs/` lub bezpośrednio w kodzie.
   - Pamiętaj o regułach globalnych (zakaz push bez zgody, zakaz DML/DDL na prodzie, etc.).
3. **Przed zakończeniem zadania / sesji:**
   - Zaktualizuj `PROJECT_STATUS.md` (sekcja "Aktualny Stan", "Najbliższe Zadania", "Dziennik Zmian").
   - Zrób czytelny lokalny commit w Git z opisem wprowadzonych zmian.

---

## 4. Struktura Dokumentacji Projektowej
```text
/home/poruszek/lukasz.poruszek.pl/
├── PROJECT_STATUS.md                 <-- Główny stan, mapa drogowa i rejestr zmian
├── README.md                         <-- Ogólny opis projektu i komendy uruchomieniowe
└── docs/
    ├── 00_CONTEXT_CONTINUITY_PROTOCOL.md  <-- Ten dokument
    ├── 01_PYTANIA_STRATEGICZNE_100.md      <-- Baza 100 pytań strategicznych i odpowiedzi
    ├── 02_DECISION_LOG.md                 <-- Rejestr decyzji architektonicznych i biznesowych (ADR)
    ├── 03_OFERTA_I_CENNIK.md             <-- Skrystalizowana oferta (po odpowiedziach)
    ├── 04_COPYWRITING_I_TRESCI.md        <-- Gotowe teksty na stronę
    └── 05_ARCHITEKTURA_TECHNICZNA.md     <-- Wybór stacku, schematy komponentów, SEO
```
