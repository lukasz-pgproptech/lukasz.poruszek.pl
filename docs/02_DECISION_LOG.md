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
