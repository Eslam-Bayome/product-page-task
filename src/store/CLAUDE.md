# Stores

- Stores hold client state only. Server data stays in TanStack Query.
- Create every store through `libs/create-store.ts`. Use `createPersistedStore` only when the state must survive a reload, and always pass a `partialize` whitelist.
- Each store has these files: `x.types.ts` (State + Actions), `x.store.ts` (with an `initial` const plus `reset`), `x.selectors.ts`, and `index.ts`.
- Call sites use selectors. Wrap object or array selectors in `useShallow`.
- When a persisted shape changes, bump `version` and add `migrate`.
