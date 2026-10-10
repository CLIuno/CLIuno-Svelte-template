# CLIuno Svelte template

SvelteKit 2 + Svelte 5 (runes) + TypeScript app implementing the CLIuno demo app
(auth, todos, posts+comments, users, follows) against the shared CLIuno REST contract.
Ships with ParaglideJS i18n (`messages/`, `project.inlang`).

## Commands

```bash
pnpm dev        # vite dev on :5000
pnpm build      # vite build (adapter-node)
pnpm check      # svelte-check
pnpm lint       # oxlint (ts) — prettier handles .svelte formatting
pnpm test:unit  # vitest
```

## Structure

- `src/lib/apis/` — the API layer on axios (`http.ts`); base URL from
  `VITE_BACKEND_URL`; Bearer token from localStorage guarded by `$app/environment`'s
  `browser`; 401 → `/login`.
- `src/lib/stores/auth.ts` — writable stores + `hydrate()/login()/register()/logout()`.
- `src/routes/` — `+layout.svelte` (navbar + ParaglideJS wrapper), pages for login,
  register, forgot-password, todos(+[id]), posts(+[id]), users(+[id]), profile.
  Svelte 5 syntax: `$state`, `$props`, `onsubmit={fn}`.

## The API contract (what backends guarantee)

Login sends `{usernameOrEmail, password}` and reads `data.token`. Responses are
`{status, message, data}` with exact keys `data.users/user/todos/todo/posts/post/`
`followers/following/isFollowing`. Any CLIuno backend template serves this contract.
Keep all URLs inside `src/lib/apis/`.

## Conventions

Tailwind 3 (unprefixed classes); oxlint for ts, prettier (+svelte plugin) for
formatting; conventional commits (commitlint + husky); pnpm build approvals in
`pnpm-workspace.yaml`.

## AI agents (Claude Code and friends)

- **Check the CLIuno skills first**: `npx cliuno@latest skills status` — if any is
  `missing`/`outdated`, run `npx cliuno@latest skills install` (adds `.claude/skills/cliuno-*`:
  the generator workflow, the scaffold guide, and the shared REST contract).
- **Generate resources, don't hand-write them**:
  `npx cliuno@latest make:resource Product --fields name:string,price:number,inStock:boolean`
  creates `src/lib/apis/product-api.ts`, `src/routes/products/+page.svelte`, `src/routes/products/[id]/+page.svelte` and registers it in `src/lib/apis/index.ts`, following this
  template's conventions and the `{status, message, data}` contract. `--dry-run` previews,
  re-running never duplicates registrations, `--force` overwrites.
- Single pieces: `make:api`, `make:page`, `make:store`, `make:component` (→ `npx shadcn-svelte@latest add`). `npx cliuno@latest make` lists them.
- Then edit fields/business logic only, and run the gates above.
