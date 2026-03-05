**Agents Guide**

- This file gives agentic coding agents concrete commands and style rules to work in this repository.
- Follow the repo scripts and shared tooling where possible; prefer non-destructive changes and create PRs for anything breaking.

- **Key files**: `package.json`, `apps/web/package.json`, `packages/contracts/package.json`, `.prettierrc`, `.husky/pre-commit`, `.github/workflows/ci.yml`

Build / Lint / Test Commands

- **Install deps (root)**: `pnpm install` (repo uses `pnpm` and a workspace setup).
- **Build (all projects)**: `pnpm build` → runs `turbo run build` from the root `package.json`.
- **Dev (all projects)**: `pnpm dev` → runs `turbo run dev` (start local dev servers for apps).
- **Lint (all projects)**: `pnpm lint` → runs `turbo run lint`.
- **Format (all projects)**: `pnpm format` → `prettier --write "**/*.{ts,tsx,md}"` (root script).

- Per-package examples:
  - `apps/web`: `pnpm --filter @acme/web dev`, `pnpm --filter @acme/web build`, `pnpm --filter @acme/web lint` (see `apps/web/package.json`).
  - `packages/contracts`: `pnpm --filter @acme/contracts build`, `pnpm --filter @acme/contracts dev`, `pnpm --filter @acme/contracts lint` (see `packages/contracts/package.json`).

- **Run a single test** (this repo currently has no canonical `test` script at the root; follow these generic patterns depending on the test runner you choose):
  1. Jest (recommended usage if added):
     - Add `"test": "jest"` to the package `package.json` for the package that owns tests.
     - Run a single spec by name: `pnpm --filter <package> test -- -t "test name"` or by filename: `pnpm --filter <package> test -- path/to/file.test.ts`
  2. Vitest (if adopted for Vite apps):
     - Add `"test": "vitest"` to the package `package.json`.
     - Run a single test by name: `pnpm --filter <package> test -- -t "test name"` or run a single file: `pnpm --filter <package> test -- path/to/file.spec.ts`
  3. Run test files directly (temporary): invoke the runner locally from node_modules, eg `npx jest path/to/file.test.ts -t "name"` or `npx vitest run path/to/file.spec.ts -t "name"`.

- If you want to run tests for one workspace package by path: `pnpm --filter ./packages/contracts test` (the `--filter <dir>` pattern works with pnpm workspaces).

CI / Hooks / Pre-commit

- CI: `.github/workflows/ci.yml` runs `pnpm install`, `pnpm build`, `pnpm lint` on PRs to `main`.
- Husky pre-commit: `.husky/pre-commit` runs `pretty-quick --staged` to format staged files with Prettier.

Code Style (automatic tools)

- Prettier is the source of truth for formatting. The project's Prettier config is in `.prettierrc`:
  - `bracketSpacing: false`, `endOfLine: lf`, `printWidth: 120`, `semi: true`, `singleQuote: true`, `trailingComma: all`.
- ESLint is configured in `tooling/eslint` and extended by apps/packages. Use the repository ESLint presets where present.

Import ordering and module rules

- Prefer clear import groups, in this order:
  1. Node / builtin modules (rare in frontend code).

2.  External packages (react, lodash, etc.).
3.  Workspace/internal packages (e.g. `@acme/contracts`).
4.  Parent imports (`../../`), then sibling imports (`./`), then index.

- Keep imports statically analyzable: avoid dynamic require/resolve inside code; prefer top-level imports.
- Use extensionless TypeScript imports: `import { X } from './foo'` not `./foo.ts`.

Formatting conventions

- Let Prettier manage whitespace and wrapping; do not add household formatting rules that conflict with `.prettierrc`.
- Keep line length to ~120 characters (Prettier enforces this).
- Use single quotes for strings (Prettier setting).

TypeScript / Types

- Use strict typing: prefer `unknown` over `any` when accepting external inputs; narrow `unknown` before use.
- Avoid `// @ts-ignore` except with a comment explaining why and a TODO to remove it.
- Export types and interfaces using `export type` / `export interface` with PascalCase.
- Component props: create `type FooProps = { ... }` and export (if used externally).
- Keep runtime value shapes validated when crossing process/app boundaries (APIs, external data). Use `zod` or schema validators (this repo includes `zod` in `packages/contracts`).

Naming conventions

- Variables and functions: camelCase (e.g. `parseUser`, `fetchData`).
- Constants: UPPER_SNAKE_CASE only for compile-time constants; otherwise use camelCase or PascalCase for exported constants.
- Types, interfaces, classes, React components: PascalCase (e.g. `UserProfile`, `LoginFormProps`).
- Hooks: `useXxx` (e.g. `useValidateLogin.ts` can live in app-level hooks).
- Files: `kebab-case` is accepted; keep consistent for all files.

React / JSX

- Functional components only; prefer React hooks over class components.
- Component filenames should match the exported component name (e.g. `LoginForm.tsx` exports `LoginForm`).
- Keep components small and focused; move shared UI into `components/` directories inside apps.

Error handling

- Prefer explicit error propagation over swallowing errors. When a function can fail, either:
  - throw an Error (and document in JSDoc), or
  - return a `Result` style object `{ ok: true, value } | { ok: false, error }` if the caller is expected to handle recoverable failures.
- Always attach context to errors: `throw new Error(`Failed to load user ${id}: ${err.message}`)` or use a custom Error class.
- Log errors with minimal PII; prefer structured logs where possible.

Testing guidance

- Add a `test` script to package `package.json` when introducing tests.
- Keep tests colocated with source using `__tests__` or next to the implementation file (`foo.test.ts`).
- Use fixtures and factories for complex data; mock only external I/O (network, FS) when necessary.

PR / Commit guidelines for agents

- Create small focused branches and PRs; include a short description and list of changed packages.
- Run `pnpm format` and `pnpm lint` locally before opening a PR.
- If a change touches multiple packages, run `pnpm build` at the root to ensure compiled packages succeed.

Agent safety notes

- NEVER change `packageManager`, `engines`, or CI workflow files without human approval.
- Non-trivial refactors or dependency upgrades should be proposed as a PR and include rationale and tests.

Where to look for more context

- Shared ESLint rules: `tooling/eslint`.
- Shared tsconfig: `tooling/typescript` and packages that extend it (see `@acme/tsconfig` in `tooling/typescript/package.json`).
- CI workflow: `.github/workflows/ci.yml`.
- Prettier config: `.prettierrc`.

Cursor / Copilot rules

- No Cursor rules directory (`.cursor/rules/`) or `.cursorrules` found in the repository root.
- No `.github/copilot-instructions.md` found. If these files are added later, update this AGENTS.md to include them.

Quick checklist for agents before creating a PR:

- - Run `pnpm install`.
- - Run `pnpm format` and `pnpm lint` in affected packages.
- - Run `pnpm build` (root) if you change compiled packages (`tsup`, `tsc`, etc.).
- - Add or update tests and ensure single-test invocations work (`pnpm --filter <pkg> test -- -t "name"`).

If you have questions or the repository adds a test runner or Cursor/Copilot rules, update this document and reference the new files.
