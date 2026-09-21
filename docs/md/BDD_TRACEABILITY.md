# BDD traceability

The Behavior-Driven Development (BDD) features under `tests/bdd/features/` are
executed by `npm run test:bdd` (`bddgen && playwright test --project=bdd`,
configured in `playwright.config.ts`). playwright-bdd binds each feature to
its step file by step text, so this page records the binding explicitly.

- `tests/bdd/features/publishing.feature` — steps in
  `tests/bdd/steps/publishing.steps.ts` (the published site is running,
  reader subscription, writings routes)
- `tests/bdd/features/runtime.feature` — steps in
  `tests/bdd/steps/runtime.steps.ts` (health contract and browser routes of
  the built runtime)

Both features compile into
`agent_context/sdoc/modules/rmet-publishing/GHERKIN.md` through
`uv run agent_commons/agent_tools/scripts/gherkin.py compile module/rmet-publishing`.
