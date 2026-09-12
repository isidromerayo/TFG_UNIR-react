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
pnpm security               # scripts/security-check.sh (replaces retired pnpm audit)
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

**Note:** `pnpm audit` endpoint is retired (HTTP 410). Use `pnpm outdated` to check for updates instead.

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

GitHub Actions: `node.js.yml` (lint→build), `tests.yml` (Jest + Cypress component/e2e + coverage + Sonar), `security.yml` (scheduled audit/Snyk), `codeql.yml`. Node 22.x, pnpm 10, `pnpm install --frozen-lockfile`.

## Quirks

- **Cypress binary**: Run `pnpm cypress install` after version changes
- **TypeScript**: `moduleResolution: "bundler"` (auto-set by Next.js 16.x)
- **Babel**: External `.babelrc` used — SWC disabled for Cypress tests
- **pnpm overrides**: `package.json` pins patched versions of vulnerable transitive deps (sharp, js-yaml, ajv, minimatch, brace-expansion, etc.)
- **Dependabot lockfiles break CI**: Dependabot-regenerated `pnpm-lock.yaml` drops the overrides section → `pnpm install --frozen-lockfile` fails with `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` in every job. Apply dep bumps manually on a branch: update overrides if needed, `pnpm up <pkg>@<ver>` (or `pnpm install --no-frozen-lockfile`), verify `pnpm install --frozen-lockfile` passes, then close the Dependabot PR (see PRs #207/#209/#210)
- **Deprecated subdependencies**: glob@7.2.3, inflight@1.0.6, rimraf@3.0.2 (ignore in audits)

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

