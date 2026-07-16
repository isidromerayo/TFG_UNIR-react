# AGENTS.md

## Project

- **Next.js 16.2.10** (Pages Router, not App Router)
- **React 19.2.4**, TypeScript 5.9.3
- **pnpm** (not npm) — `.npmrc` has `shamefully-hoist=true`
- Frontend for online course management system

## Essential Commands

```bash
pnpm dev                    # localhost:3000
pnpm lint                   # ESLint
pnpm build                  # Next.js production build
pnpm test-headless          # Jest (no watch)
pnpm test-headless-cc       # Jest with coverage
pnpm cypress:component      # Cypress component tests
```

## Pre-Commit Flow (MANDATORY)

Run in order. **Do not commit if any step fails.**

```bash
pnpm lint && pnpm test-headless && pnpm cypress:component && pnpm build
```

Or individually:
1. `pnpm lint` — fix code if fails
2. `pnpm test-headless` — 126+ tests must pass
3. `pnpm cypress:component` — 14+ tests must pass
4. `pnpm build` — must compile successfully

**Note:** `pnpm audit` endpoint is retired (HTTP 410). Use `pnpm outdated` to check for updates instead.

## Architecture

```
pages/          # Next.js Pages Router (file-based routing)
components/     # Reusable React components (6 main)
services/       # API client (Axios)
store/          # Zustand state management
utils/          # Helpers (logger, API, constants)
__tests__/      # Jest unit tests (mirrors pages/components structure)
cypress/        # Cypress component tests
```

Key files:
- `pages/_app.tsx` — App wrapper
- `pages/api/` — Backend API routes
- `store/useCartStore.ts` — Cart state (Zustand)
- `services/session.ts` — Auth/session management

## Testing

- **Jest**: `__tests__/` directory, jsdom environment, 91%+ coverage
- **Cypress**: `cypress/` directory, component testing with `@cypress/react`
- Coverage merges: `pnpm cypress:component:coverage` generates combined reports

## CI/CD

GitHub Actions in `.github/workflows/node.js.yml`:
- Node.js 20.x, pnpm 10
- Runs: lint → build → Jest tests → Cypress tests → coverage merge → audit
- SonarQube integration for code quality

## Quirks

- **Cypress binary**: Run `pnpm cypress install` after version changes
- **TypeScript**: `moduleResolution: "bundler"` (auto-set by Next.js 16.x)
- **Babel**: External `.babelrc` used — SWC disabled for Cypress tests
- **pnpm overrides**: `package.json` has overrides for transitive deps (ajv, minimatch, brace-expansion, etc.)
- **Deprecated subdependencies**: glob@7.2.3, inflight@1.0.6, rimraf@3.0.2 (ignore in audits)

## Branch Naming

```
fix/security-*        # Security fixes
feature/*             # New features
chore/deps-*          # Dependency updates
```

## Dependencies (versions as of last update)

**Production**: next 16.2.10, react 19.2.4, axios 1.13.5, zustand 5.0.11, react-hook-form 7.71.1, yup 1.6.1, sweetalert2 11.26.18

**Dev**: jest 30.2.0, cypress 15.10.0, typescript 5.9.3, eslint 9.39.2
