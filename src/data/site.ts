export interface WorkshopModule {
  number: string;
  title: string;
  subtitle: string;
  points: string[];
}

export interface WorkshopCohortData {
  cohortName: string;
  status: string;
  startDate: string;
  schedule: string;
  pricePln: number;
  prerequisite: string;
  modules: WorkshopModule[];
  features: string[];
}

export interface MentoringService {
  id: string;
  title: string;
  category: 'business' | 'career';
  duration: string;
  pricePln: number;
  tag: string;
  summary: string;
  scope: string[];
  notIncluded: string[];
}

export const site = {
  name: 'Łukasz Poruszek',
  role: 'Architekt Systemów Agentowych & Praktyk Produktu B2B',
  company: 'Polska Grupa Proptech Sp. z o.o.',
  nip: '5252814890',
  regon: '385501831',
  krs: '0000827663',
  email: 'lukasz@poruszek.pl',
  url: 'https://lukasz.poruszek.pl',
  description: 'Transfer inżynierskiej wiedzy o systemach multiagentowych, strategii B2B i rzetelnej ścieżce kariery. Oszczędzaj miesiące błądzenia: ucz się na działających wdrożeniach.',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/lukasz-poruszek/' },
    { label: 'GitHub', href: 'https://github.com/poruszek' }
  ],
  workshop: {
    cohortName: 'Kohorta #01',
    status: 'Zapisy otwarte',
    startDate: '16 marca 2026',
    schedule: '6 tygodni • 6 zjazdów online po 120 min • Czwartki 18:30-20:30',
    pricePln: 1200,
    prerequisite: 'Aktywna subskrypcja Gemini Pro lub Ultra',
    features: [
      '6 intensywnych zjazdów na żywo z inżynierskim live codingiem',
      'Pokoje robocze wymiany doświadczeń (peer review)',
      'Cotygodniowe zadania wdrożeniowe z indywidualnym pisemnym feedbackiem',
      'Indywidualna sesja 1:1 (30 min) deep-dive z Łukaszem dla każdego uczestnika',
      'Dostęp do repozytoriów, sprawdzonych konfiguracji reguł i szablonów serwerów MCP'
    ],
    modules: [
      {
        number: '01',
        title: 'Architektura zapytania i inżynieria kontekstu',
        subtitle: 'Od naiwnego promptu do deterministycznych struktur',
        points: [
          'Precyzyjne zarządzanie oknem kontekstu i eliminacja halucynacji',
          'Projektowanie schematów wyjściowych (JSON Schema, Structured Outputs)',
          'Separacja wiedzy statycznej od zmiennych danych operacyjnych'
        ]
      },
      {
        number: '02',
        title: 'Środowisko pracy agenta i protokoły projektu',
        subtitle: 'Konfiguracja profesjonalnego IDE i reguł systemowych',
        points: [
          'Architektura instrukcji: zasady globalne vs reguły przestrzeni roboczej',
          'Standard AGENTS.md / CONTEXT.md i dyscyplina dokumentacji in-repo',
          'Konfiguracja sandboxów, uprawnień i bezpiecznych terminali'
        ]
      },
      {
        number: '03',
        title: 'Projektowanie i specjalizacja subagentów',
        subtitle: 'Dekompozycja problemów i izolowane role operacyjne',
        points: [
          'Architektura agentów funkcyjnych (Researcher, Builder, Tester, Reviewer)',
          'Komunikacja międzyagentowa i protokoły przekazywania artefaktów',
          'Ochrona głównego kontekstu przed zanieczyszczeniem (context bloat)'
        ]
      },
      {
        number: '04',
        title: 'Model Context Protocol (MCP) i integracje',
        subtitle: 'Łączenie inteligencji agenta z rzeczywistymi narzędziami',
        points: [
          'Standard MCP: serwery lokalne, zdalne i hybrydowe (HTTP/SSE)',
          'Bezpieczna integracja z bazami danych, API i narzędziami analitycznymi',
          'Obsługa uwierzytelniania i kontrola uprawnień modyfikujących'
        ]
      },
      {
        number: '05',
        title: 'Orkiestracja rojów i autonomiczne pętle pracy',
        subtitle: 'Wieloetapowe procesy, samonaprawa i weryfikacja jakości',
        points: [
          'Orkiestracja równoległa i sekwencyjna (Graph vs Pipeline workflows)',
          'Pętle samonaprawy (reflection loops) i automatyczne audyty jakości',
          'Obsługa błędów, mechanizmy fallback oraz nadzór człowieka (human-in-the-loop)'
        ]
      },
      {
        number: '06',
        title: 'Wdrożenie produkcyjne, bezpieczeństwo i governance',
        subtitle: 'Przeniesienie prototypu do stabilnego środowiska firmowego',
        points: [
          'Zabezpieczenie przed prompt injection i wyciekiem danych poufnych',
          'Izolacja środowisk (dev/staging/prod) i polityka audytu operacji',
          'Rachunek ekonomiczny: koszty tokenów vs realna wartość dostarczona w biznesie'
        ]
      }
    ]
  } as WorkshopCohortData,
  mentoring: [
    {
      id: 'biznes',
      category: 'business',
      title: 'Doraźny Mentoring Biznesowy',
      duration: '90 minut',
      pricePln: 400,
      tag: '1:1 Sesja Diagnostyczna',
      summary: 'Konkretna sesja 1:1 dla założycieli i liderów produktów. Rozbijanie fałszywych ograniczeń, weryfikacja modelu biznesowego i inżynierski audyt gotowości do grantów B+R.',
      scope: [
        'Precyzyjna diagnoza problemu i wąskich gardeł w obecnym modelu produktu lub usługi',
        'Dekonstrukcja „fałszywych stałych”: identyfikacja błędnych założeń blokujących skalowanie',
        'Rzetelna ocena szans na granty B+R (ścieżki SMART, NCBR, FENG) bez marketingowych obietnic',
        'Konkretna notatka wykonawcza po sesji z krokami o najwyższym ROI'
      ],
      notIncluded: [
        'Brak szablonowych prezentacji i pustego coachingu motywacyjnego',
        'Pisanie wniosku dotacyjnego jest osobną usługą projektową'
      ]
    },
    {
      id: 'kariera',
      category: 'career',
      title: 'Doraźny Mentoring Kariery',
      duration: '90 minut',
      pricePln: 300,
      tag: '1:1 Strategia Rynkowa',
      summary: 'Inżynierskie spojrzenie na Twój profil zawodowy. Wyjaśnienie niepisanych reguł selekcji w korporacjach i firmach produktowych oraz taktyka prowadzenia rozmów rekrutacyjnych.',
      scope: [
        'Bezwzględny audyt CV i profilu LinkedIn z perspektywy hiring managera',
        'Zrozumienie różnic decyzyjnych: korporacje (procedury) vs dynamiczne MŚP (efektywność)',
        'Taktyka przejmowania inicjatywy podczas wywiadu technicznego i biznesowego',
        'Precyzyjne wycenienie własnych kompetencji i argumentacja stawek'
      ],
      notIncluded: [
        'Zero sztucznych symulacji i odgrywania ról (mock interviews)',
        'Zero generowania sztucznych tekstów przez AI: tylko autentyczna prawda'
      ]
    }
  ] as MentoringService[],
  background: {
    summary: 'Inżynier z wykształcenia (inżynieria materiałowa, Politechnika), przedsiębiorca i praktyk technologiczny z ponad dekadą doświadczenia w budowie produktów fizycznych i cyfrowych.',
    milestones: [
      {
        label: 'Polska Grupa Proptech',
        role: 'Zarząd & Architekt Rozwiązań',
        description: 'Tworzenie i rozwój innowacyjnych technologii dla sektora nieruchomości i budownictwa.'
      },
      {
        label: 'ResiCraft',
        role: 'Founder & Product Lead',
        description: 'Dedykowana platforma B2B SaaS usprawniająca procesy zarządzania i obsługi inwestycji mieszkaniowych.'
      },
      {
        label: 'Granty B+R & Wdrożenia',
        role: 'Lead Inżynierii B+R',
        description: 'Pozyskiwanie i rozliczanie wielomilionowych projektów badawczo-rozwojowych (BIPV, zaawansowane fasady, automatyzacja procesów).'
      },
      {
        label: 'Orkiestracja Agentów AI',
        role: 'Praktyk Systemów Agentowych',
        description: 'Projektowanie zaawansowanych środowisk multiagentowych w oparciu o standard MCP, sandbox i protokoły inżynierskie.'
      }
    ]
  }
};
