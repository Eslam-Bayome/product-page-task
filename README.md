# Product Detail Page

A responsive, bilingual (English / العربية) e-commerce product detail page built from the [Figma design](https://www.figma.com/design/b4iHFiwykhwvQ92LlSzTGU/Ecommerce--Product-Detail-Page--Community-?node-id=57-1305) on top of the EasyOrders API.

**Stack:** React 19 · TypeScript (strict) · Vite 8 · Tailwind CSS v4 · shadcn/ui (Radix) · TanStack Query · Zustand + Immer · use-intl · Vitest + Testing Library · Playwright

## Setup

```bash
pnpm install
cp .env.example .env    # defaults point at the public APIs
pnpm dev                # http://localhost:5173
```

| Script                              | What it does                                          |
| ----------------------------------- | ----------------------------------------------------- |
| `pnpm dev`                          | Vite dev server                                       |
| `pnpm build` / `pnpm preview`       | Type-check + production build / serve the build       |
| `pnpm typecheck`                    | `tsc -b`                                              |
| `pnpm lint` / `pnpm lint:fix`       | ESLint (typescript-eslint, react-hooks, import order) |
| `pnpm format` / `pnpm format:check` | Prettier + Tailwind class sorting                     |
| `pnpm test` / `pnpm test:watch`     | Unit, component and integration tests (Vitest)        |
| `pnpm test:e2e`                     | End-to-end tests (Playwright, builds first)           |

First e2e run: `pnpm exec playwright install chromium`.

| Variable              | Default                           | Purpose                                                      |
| --------------------- | --------------------------------- | ------------------------------------------------------------ |
| `VITE_API_URL`        | `https://api.easy-orders.net`     | EasyOrders storefront API                                    |
| `VITE_STORE_SLUG`     | `clear-theme`                     | Store                                                        |
| `VITE_PRODUCT_SLUG`   | `Sneakers12`                      | Product shown on the page                                    |
| `VITE_RATES_API_URL`  | `https://open.er-api.com`         | Daily USD exchange rates (no API key)                        |
| `VITE_ANALYTICS_MODE` | `console` in dev, `off` in builds | `console` · `mixpanel` · `off` (see [Analytics](#analytics)) |
| `VITE_MIXPANEL_TOKEN` | empty                             | Mixpanel project token, needed for `mixpanel` mode           |

## What's implemented

| Requirement                                                       | Where                                                                                                          |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Gallery: thumbnails, zoom, transitions                            | `organisms/ProductGallery`: hover zoom follows the pointer, tap zoom on touch, fade between images, arrow keys |
| Title, HTML description, sale price, categories                   | `organisms/ProductInfo`, `molecules/ProductDescription` (DOMPurify)                                            |
| Stock status indicator                                            | `ProductInfo` stock line ("In stock" / "Only N left" / "Out of stock"), `lib/product/stock.ts`                 |
| Variations: unavailable combos disabled, one product-level price  | `hooks/use-product-selection.ts`, `lib/product`                                                                |
| Add to cart: validation, quantity min/max, feedback, badge        | `ProductInfo`, `molecules/QuantitySelector`, `organisms/SiteHeader`                                            |
| Persistent cart drawer: quantities, removal, totals, empty        | `store/cart`, `organisms/CartDrawer`                                                                           |
| Responsive, mobile-first                                          | Mobile below `md`; tablet from `md` (768px): two-column hero, 3-column grids; desktop at `lg` (1024px)         |
| Lazy loading, memoisation, bundle size                            | Lazy images; below-the-fold sections code-split (main chunk 376 kB / 122 kB gzip; Mixpanel in its own chunk)   |
| API caching and error handling                                    | `integration/` (React Query, `ApiError`, not-found handling, retry)                                            |
| Tests: unit, component, integration, e2e                          | 55 Vitest tests in 16 files; Playwright spec in `e2e/`                                                         |
| Component documentation (props / usage)                           | [`docs/components.md`](docs/components.md)                                                                     |
| **Bonus:** wishlist, reviews, related products, sharing, keyboard | `store/wishlist`, `organisms/ProductReviews`, `organisms/ProductGrid`, gallery share button and arrow keys     |
| **Bonus:** analytics tracking                                     | `integration/analytics` (Mixpanel or console), see [Analytics](#analytics)                                     |
| **Extra:** Arabic / English with RTL, USD / EGP at the live rate  | `messages/`, `src/i18n`, `hooks/use-format-price.ts`                                                           |

## Architecture

```
messages/            en.json + ar.json: every UI string (type-checked keys)
src/
  app/               Page composition, providers, lazy sections
  components/
    ui/              Raw shadcn primitives (generated, never edited)
    common/          Atomic design system: atoms → molecules → organisms → layouts
  config/            Typed env
  hooks/             useProductSelection · useFormatPrice · useCountdown · useVariationLabel
  i18n/              Locale config (Intl tags, direction) + key typing
  integration/       api/ (http client, errors) · analytics · end-points · keys · services · types
  lib/               Pure logic: product (variants, pricing, stock, cart line) · reviews · catalog
  mock/              en.json + ar.json sample products & reviews (the API has one product, no reviews)
  store/             Zustand: cart · wishlist · preferences (store factory in libs/)
  styles/            Tokens from Figma: primitives → typography → semantic → root
```

**Data flow:** React Query owns server state (product, exchange rates). Zustand owns client state (cart, wishlist, language and currency). Pure functions in `lib/` hold the business rules; hooks combine them for components; components only render.

### Design system

- Tokens are taken from the Figma file. That covers the Clash Grotesk type scale, the exact palette (named by role in `semantic.css`), radii of 4/6/8 and the spacing.
- Primitives in `components/ui` are unedited. Atoms restyle them through CVA `*.variants.ts` files, merged with `cn`. `cn` uses a tailwind-merge config extended for the numeric type scale.
- Only logical CSS properties are used (`ps`/`pe`, `start`/`end`), so layouts mirror in Arabic. Directional icons carry `rtl:` flips.

### State management

- **Store factory:** `store/libs/create-store.ts` composes devtools → persist → immer. Persisted stores must whitelist their state with `partialize`, and a shape change bumps `version` and adds `migrate`.
- **Cart:**
  - A line is keyed by `productId:variantId`.
  - `addItem` merges the same variant and clamps to `[1, maxQuantity]`. It returns `{ quantity, clamped }`, so the UI can say "limit reached" without recomputing.
  - Only `items` is persisted; the drawer always starts closed.
  - Tabs stay in sync through the `storage` event.
  - Totals come from selectors.
- **Shallow APIs removed:** `increment`/`decrement` and `openCart`/`closeCart` were removed. The stepper already emits absolute values (`updateQuantity`), and the sheet speaks `setOpen`.
- **Wishlist and preferences:** both are persisted, and both use the same factory and selector pattern.

### API integration

- **Client:** `createHttpClient(baseUrl)` handles both backends. Each request gets a 30-second timeout combined with React Query's abort signal, JSON parsing, and errors normalised to `ApiError`. Actions return `{ data, error }` via `tryCatch`, and query options unwrap them.
- **Product:** `GET /api/v1/products/slug/:store/:slug?join=reviews`. Unknown slugs answer 400 "record not found", which is flagged `isNotFound` and never retried.
- **Rates:** `GET https://open.er-api.com/v6/latest/USD`, cached for 1h. A `200 { result: "error" }` body becomes an `ApiError`.
- **Pricing:** always the product's own `price` / `sale_price` (e.g. ~~$190~~ $160), whatever variant is picked. Variant prices are ignored so the price never jumps on selection. A `sale_price` of `0`, or one not below `price`, means no sale.
- **Stock:** when `track_stock` is false, everything is purchasable, capped at 10 per line.

### Language and currency

- **Translations:** `use-intl` (next-intl's core) provides `useTranslations` with type-checked keys. A test fails if `en.json` and `ar.json` diverge.
- **Arabic:** sets `lang="ar" dir="rtl"` before paint. Digits stay Western (`ar-EG-u-nu-latn`), and Arabic glyphs render in IBM Plex Sans Arabic.
- **One price path:** every amount is stored in USD (API, mock data, cart). `useFormatPrice` is the only place that converts and formats, and the `Price` atom is its only caller.
- **Switching to EGP:** the currency selector switches only after the rate has loaded. If the rate fails, it shows an error and stays on USD.

## Analytics

`src/integration/analytics/` is a small, vendor-neutral tracker:

- **Typed plan:** `events.ts` is the tracking plan. Every call is checked by type: `analytics.track("product_added_to_cart", {...})`.
- **Fire-and-forget:** the provider is created on the first call. Calls queue in order, and a blocked script or vendor outage is swallowed (`console.warn`), so tracking can never break a shopper's action.
- **Super properties:** `language` and `currency` are added to every event from the preferences store, so call sites never pass them.
- **Mixpanel:** loaded by dynamic `import()` from the SDK's core build (no session-replay recorder). It lives in its own chunk, and other modes never download it. Autocapture and automatic page views are off.

| `VITE_ANALYTICS_MODE` | Where events go                                             |
| --------------------- | ----------------------------------------------------------- |
| unset                 | `console` in `pnpm dev`, `off` in builds and tests          |
| `console`             | Browser console as `[analytics] <event> {props}`            |
| `mixpanel`            | Mixpanel, when `VITE_MIXPANEL_TOKEN` is set (otherwise off) |
| `off`                 | Nowhere                                                     |

**Naming rules:**

- Events are snake_case `<entity>_<past-tense verb>`.
- Props send ids and enum values, not display labels.
- Prices are always USD (`*_usd`), whatever currency is on screen.
- No personal data is sent: the newsletter event never carries the email.

| Event                   | Fires when                                              | Props                                                                                                    |
| ----------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `product_viewed`        | The product loads (once per product)                    | `product_id`, `product_name`, `price_usd`, `on_sale`                                                     |
| `add_to_cart_blocked`   | Add to Cart / Checkout Now with an incomplete selection | `reason`: `missing_variation` · `unavailable`, `variation`                                               |
| `product_added_to_cart` | A line is added                                         | `product_id`, `variant_id`, `quantity`, `price_usd`, `source`: `add_to_cart` · `checkout_now`, `clamped` |
| `cart_item_removed`     | A line is removed in the drawer                         | `product_id`, `variant_id`                                                                               |
| `checkout_started`      | Checkout clicked in the drawer                          | `item_count`, `subtotal_usd`                                                                             |
| `wishlist_toggled`      | The gallery heart is clicked                            | `product_id`, `saved`                                                                                    |
| `product_shared`        | Sharing succeeds                                        | `method`: `native` · `clipboard`                                                                         |
| `language_changed`      | The footer language changes                             | `language`                                                                                               |
| `currency_changed`      | The footer currency changes (after the rate loads)      | `currency`                                                                                               |
| `newsletter_subscribed` | The newsletter form is submitted                        | —                                                                                                        |

**To check it:** run `pnpm dev`, act on the page, and watch the browser console. For Mixpanel, set both variables. Events then appear in Mixpanel's Events view within a minute.

**Adapted from** the Khazenly `@repo/analytics` package. `identify`, `reset`, `timeEvent` and `trackDebounced` were left out because this page has no login, timed funnel or typed search. They can be added back behind the same `track` interface when needed.

## Design decisions (A Philosophy of Software Design)

The goal was to keep each module's interface small and to hide its decisions inside it:

- **`toCartInput(product, selections)`:** the page no longer assembles 8 cart fields. One function knows how a selection becomes a cart line.
- **`useProductSelection`:** one hook hides variant matching, availability, pricing, stock and image rules. It returns ready-to-render options plus `cartInput`.
- **`useFormatPrice`:** hides currency, rate and locale. Components pass a USD amount and nothing else, which also removed four `currency` props nobody used.
- **`createHttpClient`:** one client for two APIs, instead of a second copy of the timeout and error logic.
- **No mode-switch components:** the hero and card rating rows each have their own small markup instead of one component with a mode flag. `OptionSelect` is general-purpose: options in, value out.
- **State adjusted during render, not in effects:** the gallery following the selected color and the countdown restarting on a new duration both work this way.

## Testing

- **Unit:** product rules, cart, wishlist and preferences stores, review filtering, summary and pagination, money and date formatting, rate API handling (stubbed fetch), message-key parity, and en/ar mock data parity.
- **Component:** VariationGroup, QuantitySelector, Price (USD, EGP with a seeded rate, Arabic) and the RTL switch.
- **Integration (`src/app/cart-flow.test.tsx`):**
  1. Add without a selection is blocked, and focus moves to the missing option.
  2. Pick a variant and add it: product sale price, badge, persisted.
  3. Open the drawer from the header and change the quantity.
  4. Remove the line and see the empty state.
- **E2E (`e2e/product-flow.spec.ts`, desktop + 375px):** the cart flow including a reload, the Arabic RTL switch, and EGP at the live rate.

## Deviations from Figma

- **Data:** the API has no reviews, related products or sold counts. The design's samples come from `src/mock/*.json` and are translated.
- **States Figma doesn't show:**
  - The active thumbnail border.
  - The checked filter checkbox.
  - The wishlist-saved state.
  - Faded stars for fractional ratings.
  - The quantity stepper (required by the brief).
  - Toasts.
  - The mobile filter sheet.
- **Cart drawer:** not in Figma. It's built from the design tokens and existing molecules.
- **Stray styles:**
  - Raleway / Space Grotesk / Inter text → Clash Grotesk.
  - Fractional mobile sizes rounded to the nearest px.
  - The card rating "4,8" → "4.8".
- **Egypt flag:** hand-drawn, because Figma only has the US flag.
- **Tablet (768–1023px):** Figma has no tablet frame. The brief's "balanced two-column layout" puts the gallery and info side by side at their mobile sizes and shows the grids at 3 columns. Reviews, header and footer keep their mobile layout until `lg`.
- **Stock line:** the brief requires a stock indicator that Figma doesn't show. It's one Medium 14 line under the price, using existing tokens: success green for in stock, foreground for "Only N left" (≤ 5, tracked stock only), muted for out of stock.

## Deployment

`pnpm build` outputs a static site in `dist/`. Deploy it to any static host (Vercel, Netlify, Cloudflare Pages) with the build command `pnpm build`, output `dist`, and the `VITE_*` variables set. It's a single page, so no SPA rewrite is needed.

## Known limitations

- Search, categories, sign-in, the mobile menu, size chart, delivery terms and checkout are presentational; there's no backend for them.
- Analytics calls Mixpanel's host directly. A static host has no rewrites, so ad-blockers can drop events. A same-origin proxy, as in Khazenly, would need a server or edge rewrite.
- Not built from the bonus list: product comparison and PWA (installable app with offline caching).
