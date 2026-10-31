# AGENTS.md

## Project

- **Next.js 16.4.2** (Pages Router — *not* App Router), **React 19.3.0**, **TypeScript 5.9.3**
- **pnpm 10.17.1** (`packageManager`) — never npm; `.npmrc` sets `shamefully-hoist=true`
- Toolchain: Jest 30.5.2 + Testing Library, Cypress 15.21.1 (component + e2e), ESLint 9 flat config,
  pa11y-ci 5 stack, Zustand 5, Axios, SweetAlert2, react-hook-form + yup
- Frontend of the TFG UNIR system. Backend is Spring Boot on `:8080` (`NEXT_PUBLIC_API_URL`, default
  `http://localhost:8080/api`). Sibling repos: angular, vue3, backend — each has its own `AGENTS.md`.

## Essential Commands

```bash
pnpm dev                        # localhost:3000
pnpm lint                       # eslint . (does NOT run during next build in Next 16)
pnpm build                      # production build (Babel via .babelrc, not SWC)
pnpm test-headless              # Jest — coverage + thresholds always enforced (see Testing)
pnpm cypress:component          # 14 component tests
pnpm cypress:e2e                # needs `pnpm build && pnpm start` (visits :3000, no backend)
pnpm a11y                       # pa11y-ci — needs dev server + backend :8080 with data + system Chrome
pnpm security                   # scripts/security-check.sh (audit + OSV + accepted advisories)
pnpm security:accepted          # fails as soon as OSV publishes a fix for an accepted advisory
```

Focused local runs (both are the non-obvious forms):

```bash
pnpm test-headless __tests__/pages/categorias.spec.tsx --coverageThreshold='{}'
pnpm cypress:component --spec cypress/component/HeaderComponent.cy.tsx
```

The `--coverageThreshold='{}'` escape hatch is required for single-file Jest runs: coverage is always
collected and the *global* thresholds fail when only one suite runs.

## Pre-Commit Flow (MANDATORY)

In order; do not commit if any step fails.

```bash
pnpm lint && pnpm test-headless && pnpm cypress:component && pnpm build
```

Then expect the **external gates on the PR** to be stricter than local CI — see Quality Gates below.

## Architecture

```
pages/          # routes; dynamic segments are [id] / [query] (busqueda, categoria, curso, valoracion)
components/     # 6 components; LayoutComponent wraps everything via pages/_app.tsx
services/       # session.ts (localStorage token/user) re-exported by index.ts
store/          # useCartStore.ts (Zustand, in-memory — cart is not persisted)
types/          # index.ts: ALL API DTOs + ApiError (no `any` in page code)
utils/          # api.ts (shared axios instance), constants.ts (API_URL), logger.ts
styles/         # vendored Bootstrap/icon CSS + globals.css (no Tailwind)
__tests__/pages/        # mirrors pages/   (PLURAL)
__tests__/component/    # mirrors components/  (SINGULAR — easy to get wrong)
cypress/component, cypress/e2e
docs/plans/     # execution records: YYYY-MM-DD-brief-description.md
```

## API & data-loading conventions (match these)

- Use the shared instance `utils/api.ts`. Never call raw `axios` — that bypasses the 30 s timeout,
  the retry policy (GET/HEAD/OPTIONS only, 3 tries, backoff 500/1000/1500 ms on network/429/5xx) and
  the error interceptors that preserve `response`, `status` and `code`.
- `baseURL` is already `API_URL`; pages pass absolute URLs (`${API_URL}/...`) — both work, keep the
  page style consistent.
- HAL payloads: type the call as `api.get<Partial<CursoEmbedded>>(…)`,
  `<Partial<CategoriaEmbedded>>`, `<Partial<ValoracionEmbedded>>`, then guard with
  `Array.isArray(response.data._embedded?.cursos)`. Untyped `api(url)` returns `any` and trips Codacy.
- `useEffect` data loading: inner `async fetchData()` with `try/catch/finally`, `logger.error(…,
  { message, status })` in the catch, empty-array fallback, `setLoading(false)` **only in `finally`**
  (otherwise a failed request leaves an infinite spinner), and invoke it as `void fetchData()`.
- `router.push(...)` is typed `Promise<boolean>` — it is also a floating promise; use `void push(...)`
  if an analyzer flags it. `.then()` chains must end in `.catch()` (see `pages/mis-cursos.tsx`).
- User-facing errors go through SweetAlert2 in every frontend (team convention).
- `services/session.ts` guards `localStorage` with `isBrowser()`; never touch `localStorage` directly
  from components (breaks SSR/jsdom).
- `pages/registro.tsx` uses react-hook-form + yup; the other forms are controlled `useState`. Do not
  "unify" them as a side effect of a task.

## Quality Gates (what actually breaks a PR)

- **Codacy PR check allows 0 new issues** (conclusion `action_required` = fail, even though Jest,
  Cypress, lint and build are green). Rules that fire on this codebase:
  `no-unsafe-assignment`/`no-unsafe-member-access` (untyped `_embedded` reads),
  `unbound-method` (referencing `logger.error` off the real `Logger` instance in specs),
  `no-empty-function` (`new Promise(() => {})`).
  Verify locally before pushing: run ESLint 9 with type-aware parsing and those rule families
  (`npx eslint --no-config-lookup -c <type-aware config> <files>`), because `pnpm lint` cannot see them.
- **SonarCloud** (`sonar-project.properties`, key `isidromerayo_TFG_UNIR-react`): gate is on *new
  code*, `new_coverage ≥ 80%` — new lines need tests. Recurring rules: `typescript:S9383`
  (floating promise), `typescript:S9379` (`autoFocus` — remove it, don't replace it with a `ref`
  focus, that is the same defect).
- Local `eslint.config.mjs` is **not** type-aware (3 rules + `next/core-web-vitals`), so `pnpm lint`
  will not catch any of the above. Don't enable type-aware linting casually: it unblocks a large
  backlog of pre-existing findings.
- `pnpm audit --prod` is the blocking security step in `security.yml`; the full audit (dev + prod) is
  warning-only. `ACCEPTED` lists are currently empty — a *silenced* advisory is allowed only while
  upstream has no patch (registry + checklist: `docs/security/accepted-advisories.md`).

## Testing

- Coverage is always collected. Thresholds (`jest.config.js`): global branches 45 / functions 59 /
  lines+statements 63; `components/**` 85 functions/lines/statements, branches 50; `services/**` 85;
  `store/**` 100 functions/lines/statements, branches 80. **Never lower a threshold or add a
  `collectCoverageFrom` exclusion** — cover the new branch instead.
- Current baseline: 25 suites / 143 tests, statements 95.2%, branches 75.6%, lines 95.5%.
- Mock `utils/api`, never axios: `jest.mock('../../utils/api', () => ({ __esModule: true, default: { get: jest.fn() } }))`.
- Do **not** `import { jest } from '@jest/globals'` in a file that declares hoisted `jest.mock`
  factories — the factory registers against a different instance and `mockResolvedValue` blows up at
  runtime. Use the global `jest` like the other specs do.
- Take typed mock handles to avoid Codacy `unbound-method`:
  `const mockedApiGet = jest.requireMock<{ default: { get: jest.Mock } }>('../../utils/api').default.get;`
- `getServerSideProps` is unit-tested directly (mock `global.fetch`); component tests need
  `jest.mock('next/router')` returning `{ isReady: true, push: jest.fn() }` when the page calls `useRouter`.
- Cypress component tests run through Babel + `babel-plugin-istanbul`; coverage needs
  `pnpm cypress:component:coverage`, and Jest+Cypress lcov get merged (`coverage:merge`, and in CI by
  `tests.yml`) before Sonar reads `coverage/merged/lcov.info`.
- E2E has a single spec (`cypress/e2e/app.cy.js`) with **no backend**: `defaultCommandTimeout` is
  8000 ms so the API retry backoff (~3 s) plus the error fallback lands inside the window. Keep that
  timeout if you touch `utils/api.ts` retry timing.

## CI/CD

`.github/workflows/`: `node.js.yml` (lint → build), `tests.yml` (Jest + Cypress component + e2e,
coverage comment, SonarCloud), `security.yml` (scheduled/PR audit, Snyk, OSV, accepted-advisory
recheck), `codeql.yml`, `a11y.yml` (pa11y weekly/dispatch, `continue-on-error` — informative).
All jobs: Node 22.x, `pnpm 10.17.1`, `pnpm install --frozen-lockfile`, every third-party action
pinned to a 40-char SHA, secrets never used in `if:` (guard with `if: env.X != ''`).

## Quirks

- **Dependabot lockfiles break CI**: a regenerated `pnpm-lock.yaml` drops `pnpm.overrides` →
  `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` in every job. Apply bumps manually on a branch (`pnpm up <pkg>`,
  verify `pnpm install --frozen-lockfile`) and close the Dependabot PR.
- **`pnpm.overrides` in `package.json` pin patched versions of transitive deps** (sharp, js-yaml, ajv,
  minimatch, brace-expansion, follow-redirects, form-data, …). Never strip them when "cleaning".
- **`pnpm audit --ignore-unfixable` rewrites `package.json`**, appending CVEs to
  `pnpm.auditConfig.ignoreCves`. Use `pnpm.overrides` for anything with a patch; guide in
  `docs/security/pnpm-audit-unfixable-cves.md`.
- **Babel**: external `.babelrc` (`next/babel` + istanbul) is used by Jest, Cypress *and* `next build`
  — SWC is not in play.
- **Cypress binary**: re-run `pnpm cypress install` after a version bump.
- **pa11y**: uses `/usr/bin/google-chrome-stable` (`.pa11yci`); reports go to `reports/a11y/`
  (gitignored). Stack is unified across the three frontends (`pa11y` 10 / `pa11y-ci` 5 / reporter 9,
  Node ≥ 22.13) and `pa11y-ci` does not validate the reporter's `supports` field — the only real
  compatibility test is running `pnpm a11y`. Bump ci + reporter in the same branch; full guide
  `docs/accessibility.md`.
- **TypeScript**: `moduleResolution: "bundler"`, `strict`, and `__tests__`/`cypress` are *excluded*
  from `tsconfig.json` — a type-aware ESLint run over specs needs its own tsconfig.
- Deprecated subdependencies still in the tree: glob@7, inflight@1, rimraf@3 (ignore in audits).

## Branch Policy (MUST)

- **NEVER commit or push directly to `main`/`master`.** No force-push either.
- All changes go through a branch + PR: prefixes `feature/`, `fix/`, `docs/`, `ci/`, `chore/`,
  `security/`, `release/`.
- Commits MUST follow Conventional Commits — use the `codely-git-conventional_commit` skill FIRST for
  any commit (it derives type/summary from the diff and adds the AI `Co-Authored-By:` trailer).
- Open with `gh pr create`, merge with `gh pr merge --squash --delete-branch` **only after every check
  is green** (a green Jest/lint/build set is not enough — Codacy and SonarCloud gate the PR).
- Releases: `release/X.Y.Z` branch → PR → tag from the updated `main`.

## Plan Mode & Execution Records (MUST)

- In plan mode, state it in every response and change nothing until the user approves with `adelante`.
- Non-trivial plans go to `docs/plans/YYYY-MM-DD-brief-description.md` with date, tool/model used,
  objectives, file changes, verification steps, design decisions and status (planned/in progress/done).
- Confirm explicit user approval before executing; record the outcome afterwards in the same file.
- When the user corrects an undocumented convention, document it with the `codely-doc-create` skill.

## Docs

- `docs/security/accepted-advisories.md` — accepted (unpatched) advisories + the recheck rule.
- `docs/security/pnpm-audit-unfixable-cves.md` — when/how to silence an unfixable CVE.
- `docs/accessibility.md` — pa11y stack, upgrade policy, how to run the audit.
- `docs/plans/` — execution records; the newest files describe the current conventions.
- Root `AGENTS.md` (`TFG_UNIR-multi/`) — monorepo layout and cross-project conventions. The root
  directory is not a git repo; commit inside this one.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
