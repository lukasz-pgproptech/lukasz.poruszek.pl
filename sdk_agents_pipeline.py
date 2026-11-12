"""
sdk_agents_pipeline.py
======================
Przykładowa implementacja orkiestracji subagentów za pomocą oficjalnego Google Antigravity SDK:
1. visual_bug_detector - subagent inspekcji wizualnej (3D WebGL, layout, responsywność).
2. qa_acceptance_auditor - niezależny subagent odbioru prac i weryfikacji poprawek.
"""

import asyncio
import os
from google.antigravity import Agent, LocalAgentConfig, types

# ------------------------------------------------------------------------------
# 1. Definicja Subagenta: Visual Bug Detector
# ------------------------------------------------------------------------------
visual_bug_detector = types.SubagentConfig(
    name="visual_bug_detector",
    description="Wykrywa błędy wizualne, defekty renderowania 3D/DOM, ucinanie elementów i problemy responsywności (mobile/desktop).",
    system_prompt="""
Jesteś autonomicznym subagentem Visual QA & Multi-Viewport Inspector, wyspecjalizowanym w wykrywaniu błędów wizualnych w serwisie lukasz.poruszek.pl.
Twoim celem jest identyfikacja:
- Rozbieżności geometrycznych na ekranach 360px, 390px (iPhone), 768px (iPad) oraz desktopie,
- Kolizji warstw 3D WebGL (Three.js obiekty, tekst MSDF, orbitalne 3D Hotspoty) z warstwą HTML/DOM,
- Ucinania przycisków i treści (np. przycisk zamknięcia ✕ modalu kolidujący z zakładkami),
- Błędów jednostek wysokości (vh vs dvh) i zjadania przestrzeni ekranu.
Zwracaj raport z dokładnymi selektorami CSS, wymiarami w pikselach oraz rekomendacjami naprawczymi.
""",
    capabilities=types.SubagentCapabilities(
        agent_behavior=types.AgentBehavior.AUTONOMOUS,
        enabled_tools=[
            types.BuiltinTools.VIEW_FILE,
            types.BuiltinTools.READ_URL_CONTENT,
        ],
    ),
)

# ------------------------------------------------------------------------------
# 2. Definicja Subagenta: QA Acceptance Auditor
# ------------------------------------------------------------------------------
qa_acceptance_auditor = types.SubagentConfig(
    name="qa_acceptance_auditor",
    description="Niezależny subagent audytowy odbioru prac, weryfikujący wdrożone poprawki pod kątem poprawności, regresji, API i wydający certyfikat odbioru.",
    system_prompt="""
Jesteś autonomicznym subagentem Lead Acceptance QA & Compliance Gatekeeper.
Twoim celem jest niezależny i bezkompromisowy odbiór prac wdrożeniowych na serwisie lukasz.poruszek.pl:
- Weryfikacja każdego zgłoszonego błędu w macierzy pod kątem faktycznego usunięcia w kodzie,
- Uruchamianie i weryfikacja automatycznych testów (node test-audit.mjs),
- Sprawdzanie integralności kontraktów API i danych transakcyjnych (eliminacja undefined, NIP, ZBP QR),
- Egzekwowanie polityk bezpieczeństwa (brak samowolnych pushy, zero modyfikacji nieautoryzowanych zasobów GCP/Firebase).
Wydaj jednoznaczny werdykt: ACCEPTED lub REJECTED wraz z protokołem odbioru technicznego.
""",
    capabilities=types.SubagentCapabilities(
        agent_behavior=types.AgentBehavior.AUTONOMOUS,
        enabled_tools=[
            types.BuiltinTools.VIEW_FILE,
            types.BuiltinTools.RUN_COMMAND,
            types.BuiltinTools.READ_URL_CONTENT,
        ],
    ),
)

# ------------------------------------------------------------------------------
# 3. Konfiguracja Orkiestratora Głównego
# ------------------------------------------------------------------------------
async def run_pipeline():
    api_key = os.getenv("GEMINI_API_KEY", "")

    config = LocalAgentConfig(
        api_key=api_key if api_key else None,
        subagents=[visual_bug_detector, qa_acceptance_auditor],
        capabilities=types.CapabilitiesConfig(
            enable_subagents=True,
            max_subagent_depth=2,
            allowed_subagents=["visual_bug_detector", "qa_acceptance_auditor"],
        ),
    )

    print("Inicjalizacja Google Antigravity SDK Agent z subagentami QA...")
    async with Agent(config) as orchestrator:
        print("\n--- FAZA 1: Detekcja Błędów Wizualnych ---")
        visual_task = (
            "Uruchom subagenta 'visual_bug_detector', aby zbadał widok mobilny strony https://lukasz.poruszek.pl "
            "pod kątem kolizji warstw 3D z nakładkami HTML, widoczności selektora usług oraz touch targetów."
        )
        response_visual = await orchestrator.chat(visual_task)
        print(await response_visual.text())

        print("\n--- FAZA 2: Niezależny Odbiór Prac po Poprawkach ---")
        qa_task = (
            "Uruchom subagenta 'qa_acceptance_auditor', aby zweryfikował ostatnio wdrożone poprawki "
            "w plikach booking-widget.css, products-view.js, workers/api/src/index.js oraz uruchomił testy 'node test-audit.mjs'. "
            "Sporządź formalny Certyfikat Odbioru (ACCEPTED / REJECTED)."
        )
        response_qa = await orchestrator.chat(qa_task)
        print(await response_qa.text())

if __name__ == "__main__":
    asyncio.run(run_pipeline())
