# AGENTS.md

## Project

- **Next.js 16.x** (Pages Router, not App Router)
- **React 19.x**, TypeScript 5.9.3
- **pnpm** (not npm) — `.npmrc` has `shamefully-hoist=true`
- Frontend for online course management system

## Essential Commands

```bash
pnpm dev                    # localhost:3000
pnpm lint                   # ESLint
pnpm build                  # Next.js production build
pnpm test-headless          # Jest (no watch; coverage always collected, see Testing)
pnpm cypress:component      # Cypress component tests
pnpm cypress:e2e            # Cypress e2e tests
pnpm a11y                   # pa11y-ci audit (htmlcs+axe, WCAG2AA) — requires dev server on :3000
pnpm security               # scripts/security-check.sh (pnpm audit + OSV + accepted advisories)
```

Single Jest test file: `pnpm test-headless __tests__/path/to/file.test.tsx`

## Pre-Commit Flow (MANDATORY)

Run in order. **Do not commit if any step fails.**

```bash
pnpm lint && pnpm test-headless && pnpm cypress:component && pnpm build
```

Or individually:
1. `pnpm lint` — fix code if fails
2. `pnpm test-headless` — 130+ tests must pass
3. `pnpm cypress:component` — 14+ tests must pass
4. `pnpm build` — must compile successfully

**Note:** `pnpm audit` es el gate de producción del repo (`pnpm audit --prod`, paso *pnpm audit
(production gate)* de `security.yml`); el endpoint vuelve a responder. Un advisory **con** parche se
corrige con `pnpm.overrides`, nunca con `auditConfig.ignoreCves`. El audit completo (dev + prod) se
reporta como warning, no bloquea.

## Architecture

```
pages/          # Next.js Pages Router (file-based routing)
components/     # Reusable React components (6 main)
services/       # API client (Axios) + session management
store/          # Zustand state management
utils/          # Helpers (logger, API, constants)
__tests__/      # Jest unit tests (mirrors pages/components structure)
cypress/        # Cypress component tests
```

Key files:
- `pages/_app.tsx` — App wrapper
- `store/useCartStore.ts` — Cart state (Zustand)
- `services/session.ts` — Auth/session management (localStorage)
- `utils/api.ts` — Axios instance with retry/interceptors
- `utils/constants.ts` — `API_URL` from `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8080/api`)

## Testing

- **Jest**: `__tests__/` directory, jsdom environment, ~92% line coverage
- Coverage is ALWAYS collected (`collectCoverage: true` in `jest.config.js`) and thresholds are enforced even by `pnpm test-headless` — low coverage fails the run. `store/` requires 100% functions/lines/statements.
- **Cypress**: `cypress/` directory (`component/` and `e2e/`), component testing with `@cypress/react` + webpack/Next dev server
- Coverage merges: `pnpm cypress:component:coverage` generates combined reports

## CI/CD

GitHub Actions: `node.js.yml` (lint→build), `tests.yml` (Jest + Cypress component/e2e + coverage + Sonar), `security.yml` (scheduled audit/Snyk), `codeql.yml`, `a11y.yml` (pa11y semanal/dispatch, informativo — sin gate de merge). Node 22.x, pnpm 10, `pnpm install --frozen-lockfile`.

## Quirks

- **Cypress binary**: Run `pnpm cypress install` after version changes
- **TypeScript**: `moduleResolution: "bundler"` (auto-set by Next.js 16.x)
- **Babel**: External `.babelrc` used — SWC disabled for Cypress tests
- **pnpm overrides**: `package.json` pins patched versions of vulnerable transitive deps (sharp, js-yaml, ajv, minimatch, brace-expansion, etc.)
- **`pnpm audit --ignore-unfixable` rewrites `package.json`**: it automatically appends the ignored unfixable CVEs to `pnpm.auditConfig.ignoreCves`, so `git diff package.json` shows changes after auditing. See `docs/security/pnpm-audit-unfixable-cves.md`
- **Dependabot lockfiles break CI**: Dependabot-regenerated `pnpm-lock.yaml` drops the overrides section → `pnpm install --frozen-lockfile` fails with `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` in every job. Apply dep bumps manually on a branch: update overrides if needed, `pnpm up <pkg>@<ver>` (or `pnpm install --no-frozen-lockfile`), verify `pnpm install --frozen-lockfile` passes, then close the Dependabot PR (see PRs #207/#209/#210)
- **Deprecated subdependencies**: glob@7.2.3, inflight@1.0.6, rimraf@3.0.2 (ignore in audits)
- **Accepted advisories (no upstream patch)**: an advisory is only ever "accepted" when no patched
  version is published. It must be registered in `docs/security/accepted-advisories.md` and
  rechecked every iteration: `pnpm security:accepted` (step *Accepted advisories recheck* in
  `security.yml`) fails as soon as OSV publishes a fix — then bump the dependency and remove the
  silencing (`pnpm.auditConfig.ignoreCves`, the `ACCEPTED` list, the Dependabot dismissal) in the
  same PR.
- **pa11y uses system Chrome**: `.pa11yci` points `chromeLaunchConfig.executablePath` at `/usr/bin/google-chrome-stable`. Reports land in `reports/a11y/` (gitignored). Requires dev server on :3000 and backend on :8080 for `/categorias`, `/categoria/:id`, `/curso/:id`.
- **pa11y stack (unificado 2026-10-31 con angular y vue3)**: `pa11y@10` + `pa11y-ci@5` + `pa11y-ci-reporter-html@9`; engines exigen Node ≥ 22.13. `pa11y-ci@5` arrastra puppeteer 25 (ya no existe `extract-zip` en el árbol). El reporter 9 requiere pa11y-ci 5 vía su propiedad `supports`, pero **pa11y-ci no la valida**: la única prueba de compatibilidad es ejecutar `pnpm a11y`. Ningún check de PR corre pa11y (`a11y.yml` es semanal/dispatch) — verde de CI ≠ a11y funcionando.
- **pa11y upgrade policy**: bump `pa11y-ci` and `pa11y-ci-reporter-html` in the same branch (never reporter-only past a pa11y-ci major), re-lock with `pnpm install` locally, verify the `pnpm.overrides` survive the lock diff, and run `pnpm a11y` (dev server + backend) before merging. Close any Dependabot PRs for this tree and apply the bump manually (lockfile gotcha above). Full guide: `docs/accessibility.md`.

## Branch Policy (MUST)

- **NEVER commit or push directly to `main` or `master`.**
- All changes (code, docs, CI, dependency updates, security fixes and hotfixes) MUST go through a branch and a Pull Request.
- Use descriptive branch prefixes: `feature/`, `fix/`, `docs/`, `ci/`, `chore/`, `security/`, `release/`.
- Prefer **squash merge** for a clean linear history.
- **NEVER force-push to `main` or `master`.**
- Releases MUST use a `release/X.Y.Z` branch, merge it via PR, then create the Git tag from the updated `main` branch.
- This policy applies to both human contributors and AI agents.

## Plan Mode & Execution Records (MUST)

- When in **plan mode**, state it explicitly in every response and do NOT execute changes until the user approves with `adelante` and the system switches to build mode.
- All non-trivial plans MUST be saved to `docs/plans/` with the format `YYYY-MM-DD-brief-description.md`.
- Plan files MUST include: date, tool/model used, objectives, file changes, verification steps, design decisions, and current status (planned/in progress/done).
- Before executing a plan, confirm explicit user approval.
- After execution, record the outcome and update the plan status.
- When the user corrects an undocumented convention, use the `codely-doc-create` skill to document it under `docs/` (categories from `ls docs/`, Good/Bad examples).

## Git Workflow (MANDATORY)

- **NEVER commit or push directly to `main`.** All work goes through a feature branch and a pull request.
- Keep `main` in sync with `origin/main` (`git pull --rebase origin main`) before branching.
- Open a PR with `gh pr create` and merge it via the GitHub UI / `gh pr merge` — never by direct push.
- Only merge `main` (e.g. dependabot security fixes or release chores) through reviewed, green PRs.
- **Commits MUST follow Conventional Commits** (`type: summary`, e.g. `fix(security): ...`). Use the `codely-git-conventional_commit` skill FIRST for any commit: it derives type/summary from the diff, uses present tense and lowercase, and adds the `Co-Authored-By:` AI trailer.

## Docs

- `docs/security/pnpm-audit-unfixable-cves.md` — when and how to pin an unfixable CVE in `pnpm.auditConfig.ignoreCves`.
- `docs/security/accepted-advisories.md` — registry of accepted advisories (no upstream patch) + the rule to recheck them every iteration.
- `docs/plans/` — execution records for non-trivial changes (`YYYY-MM-DD-brief-description.md`).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
