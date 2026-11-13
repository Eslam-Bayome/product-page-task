# Components

- `ui/` holds raw shadcn primitives (`pnpm dlx shadcn@latest add <name>`). Don't edit these to change design. Restyle them from an atom through its `*.variants.ts` (CVA), merged with `cn`.
- `common/` follows atomic design, with the levels `atoms`, `molecules`, `organisms` and `layouts`.
  - One PascalCase folder per component: `X.tsx`, `X.types.ts`, `X.variants.ts` (only when it has variants), `index.ts`.
  - Use named function exports, never default exports.
  - Barrels chain upward: component → level `index.ts` → `common/index.ts`.
  - An atom that wraps a primitive imports it under an alias, e.g. `Button as ShadcnButton`.
- Use semantic token classes only (`bg-primary`, `text-muted-foreground`, `bg-surface-image`) and logical properties (`ps-`, `ms-`, `start-`, `end-`).
- UI text comes from `messages/en.json` + `messages/ar.json` via `useTranslations` (keys type-checked; keep both files in sync — a test enforces it). Numbers and dates use `useFormatter` / the active locale, never `en-US`.
- Every amount is USD. Render money only through the `Price` atom (`useFormatPrice` converts to the shopper's currency); never format prices elsewhere.
