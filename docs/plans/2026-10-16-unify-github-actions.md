# Unify GitHub Actions workflows with angular as baseline

- **Date**: 2026-10-16
- **Tool/model**: opencode — DeepSeek V4.1 Flash (medium)
- **Status**: done (branch `ci/unify-github-actions`, PR open)

## Objectives

Unify the GitHub Actions configuration of the three frontends so the CI comparison between
frameworks is not biased by workflow differences. The canonical baseline is **Angular**: a hard
`pnpm audit --prod` production gate and a SonarQube job in `tests.yml` guarded by
`if: env.SONAR_TOKEN != ''`.

## File changes

- `.github/workflows/node.js.yml`: split the single `build` job into `lint` and `build` jobs and
  drop the duplicated test/Cypress/coverage/audit steps (they already run in `tests.yml` and
  `security.yml`).
- `.github/workflows/security.yml`: adopt the Angular hard production gate, byte-for-byte
  identical across the three frontends. The gate uses the `pnpm audit --prod` **exit code** so it
  respects `pnpm.auditConfig.ignoreCves` (this repo has two ignored CVEs; the JSON metadata still
  reports them as `high`). Contrary to the AGENTS note, `pnpm audit` works in CI (HTTP 410 no
  longer observed), so the `pnpm security` script is no longer used as the gate.
- `.github/workflows/tests.yml`: action SHA bumps only (the guarded SonarQube job already exists).
- `.github/workflows/codeql.yml`: align the schedule cron and bump `github/codeql-action`.
- Actions pinned to current versions (SHA + `# vX.Y.Z`): setup-node v7.1.0, upload-artifact
  v7.0.2, download-artifact v8.0.2, codeql-action v4.38.3, osv-scanner v2.7.0,
  lcov-reporter-action v0.4.0, sonarqube-scan-action v8.3.0, snyk/actions/node.

## Design decisions

- Angular is the baseline (hard security gate, SonarQube in `tests.yml`).
- The production gate relies on the `pnpm audit --prod` exit code rather than parsing the JSON
  metadata, because ignored CVEs (`pnpm.auditConfig.ignoreCves`) still appear in the metadata.
- `.github/dependabot.yml` already matched the unified schema (weekly, labels, commit-message),
  so it is left unchanged.

## Verification

- `actionlint` 1.7.12 over all workflows: no errors.
- `yaml.safe_load` over every workflow: valid.
- No floating action tags remain.
- Expected CI: all workflows green; the SonarQube job stays `skipped` on Dependabot PRs.
- Replaces Dependabot PRs `#250` (actions-minors) and `#246` (snyk/actions/node), whose bumps are
  included here and applied identically across the three frontends.
