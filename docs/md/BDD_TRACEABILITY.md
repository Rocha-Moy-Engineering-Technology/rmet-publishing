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

Both step files take their `test` from `tests/bdd/steps/fixtures.ts`, which
adds the fixture sites of `tests/support/fixture-sites.ts`; the publishing
scenarios run against `subscribeSite`, built once per run rather than once per
scenario.

Every scenario title, like every other test title in `tests/`, ends with the
acceptance criterion it proves, for example `(A6.1)`; the criteria are in
`agent_context/sdoc/modules/rmet-publishing/FEATURE_SPECS.md`, and each one
names its tests back.

Both features compile into
`agent_context/sdoc/modules/rmet-publishing/GHERKIN.md` through
`uv run agent_commons/agent_tools/scripts/gherkin.py compile module/rmet-publishing`.
