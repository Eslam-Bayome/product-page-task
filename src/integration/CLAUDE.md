# Integration

- `api/`: `createHttpClient` + the `EasyOrdersBackend` / `RatesBackend` instances, `ApiError`, `tryCatch` (→ `ActionResult`) and the QueryClient/provider.
- `end-points/`: path templates with `:param` placeholders.
- `keys/`: query-key roots. Keys are arrays, e.g. `[Keys.products.details, storeSlug, slug]`.
- `services/<domain>/<action>/` contains:
  - `x.action.ts`: the request, returning an `ActionResult`
  - `x.query.ts`: `queryOptions`
  - `use-x.ts`: the hook
  - `index.ts`
- `types/responses/<domain>/`: one type per file, snake_case to mirror the API.
