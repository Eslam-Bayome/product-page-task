# Components

Every component lives in `src/components/common/<layer>/<Name>/`:

- `Name.tsx`: the component, a named export.
- `Name.types.ts`: its props.
- `Name.variants.ts`: its CVA styles, when it has variants.
- `index.ts`: the barrel.

Each layer only composes the ones below it: **atoms → molecules → organisms → layouts**. The generated shadcn primitives in `src/components/ui` are never edited. Each one is wrapped by exactly one atom or molecule that restyles it.

Every component also accepts `className` (merged with `cn`) and, unless noted, the props of its root element.

## Rules

- **Money:** render it only through `Price` (or `PriceBlock`). Amounts are always USD. `Price` converts and formats them for the shopper's currency and language.
- **Text:**
  - Every built-in string comes from `messages/en.json` + `messages/ar.json` via `useTranslations`.
  - Text props passed by the caller win over the built-in strings.
- **Direction:**
  - Use logical CSS only (`ps`/`pe`, `ms`/`me`, `start`/`end`, `text-start`), so Arabic mirrors.
  - Directional icons carry an `rtl:` flip.
- **Breakpoints:**
  - Below `md` (768px): mobile, which is Figma's mobile frame.
  - `md` (768px): tablet, two columns for the hero and three for the grids. Figma has no tablet frame.
  - `lg` (1024px) and up: desktop, which is Figma's desktop frame.
- **No mode flags:** a component never switches its layout on a `type` or `isX` prop. Two different layouts are two components.

## Atoms

| Component        | Purpose                                 | Key props                                                                                                                                                 |
| ---------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`         | Every text button                       | `variant`: `primary` · `outline` · `soft` · `ghost` · `link`; `size`: `sm` · `md` · `lg` · `xl` · `icon*`; `fullWidth`, `loading`, `startIcon`, `endIcon` |
| `IconButton`     | Icon-only button                        | `icon`, `label` (required accessible name), `size`: `icon` · `icon-sm` · `icon-lg`, plus `Button`'s `variant`                                             |
| `Typography`     | Figma text styles                       | `variant`: `display` · `heading` · `title` · `body` · `label` · `caption`; `tone`: `default` · `heading` · `muted` · `subtle` · `faint` · `inherit`; `as` |
| `Price`          | One formatted amount                    | `amount` (USD), `variant`: `current` · `compare`, `size`: `sm` · `md` · `lg`                                                                              |
| `ColorSwatch`    | Image or color option in a toggle group | `label`, `imageUrl` or `color`, `value`, `disabled`                                                                                                       |
| `SizeOption`     | Text option in a toggle group           | `value`, `disabled`, `children`                                                                                                                           |
| `CountBadge`     | Cart count bubble                       | `count`, `max` (shows `max+`)                                                                                                                             |
| `RatingStars`    | 0–5 stars, fractional fill              | `rating`, `max`, `size`                                                                                                                                   |
| `ScoreRing`      | Review score donut                      | `score`, `max`                                                                                                                                            |
| `FilterCheckbox` | Review-filter checkbox                  | Radix checkbox props (`checked`, `onCheckedChange`, `id`)                                                                                                 |
| `DashedDivider`  | The design's 6/6 dashed rule            | `<hr>` props                                                                                                                                              |

```tsx
<Price amount={160} size="lg" />            // "$160" or "EGP 8,551.8"
<Typography variant="title" tone="heading">Description:</Typography>
<IconButton label={t("share")} icon={<img src={shareIcon} alt="" />} onClick={share} />
```

## Molecules

| Component            | Purpose                                            | Key props                                                                                                                             |
| -------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `PriceBlock`         | Price with a struck-through original               | `price`, `compareAtPrice` (shown only when higher), `size`                                                                            |
| `VariationGroup`     | Label + swatches or size buttons for one variation | `name`, `type`: `image` · `button`, `options[]` (`value`, `label`, `imageUrl?`, `disabled?`), `value`, `onValueChange`, `action` slot |
| `QuantitySelector`   | − value + stepper, clamped                         | `value`, `onChange`, `min`, `max`, `disabled`, `label` (required, names the stepper), `size`                                          |
| `ProductDescription` | Sanitised HTML description with See More / Less    | `html` (untrusted; DOMPurify)                                                                                                         |
| `ThumbnailList`      | Gallery thumbnails                                 | `images[]` (`src`, `alt`), `activeIndex`, `onSelect`                                                                                  |
| `ProductCard`        | Grid card                                          | `imageUrl`, `brand`, `name`, `price`, `rating?`, `soldCount?`, `href?`                                                                |
| `CartLineItem`       | One cart line                                      | `name`, `imageUrl`, `options`, `unitPrice`, `compareAtPrice`, `quantity`, `maxQuantity`, `onQuantityChange`, `onRemove`               |
| `SectionHeader`      | Section title + trailing action                    | `title`, `action`, `as`: `h2` · `h3`                                                                                                  |
| `ReviewSummary`      | Score ring + per-star bars                         | `summary` (from `summarizeReviews`)                                                                                                   |
| `RatingBar`          | One per-star bar                                   | `stars`, `count`, `total`                                                                                                             |
| `ReviewItem`         | One review with like / dislike                     | `review`, `liked`, `disliked`, `onLike`, `onDislike`                                                                                  |
| `ReviewPagination`   | Numbered pages with ellipsis                       | `page` (1-based), `pageCount`, `onPageChange`                                                                                         |
| `OptionSelect`       | Generic dropdown (footer language / currency)      | `label`, `value`, `options[]` (`value`, `label`, `iconUrl?`), `onValueChange`                                                         |
| `SheetCloseButton`   | Translated close button for sheets                 | `className`                                                                                                                           |

```tsx
<VariationGroup
  name="Size"
  type="button"
  options={[{ value: "40", label: "40" }, { value: "42", label: "42", disabled: true }]}
  value={size}
  onValueChange={setSize}
/>

<QuantitySelector value={qty} onChange={setQty} max={10} label="Sneakers quantity" />

<ProductCard imageUrl={img} brand="Nike" name="Air Max" price={120} rating={4.8} soldCount={2400} />
```

## Organisms

Organisms read the stores themselves, so a page only passes data.

| Component           | Purpose                                                           | Props                                                          | Reads / writes              |
| ------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------- |
| `AnnouncementBar`   | Top banner with a live countdown                                  | `durationSeconds`                                              | —                           |
| `SiteHeader`        | Logo, nav, cart button + badge                                    | header props                                                   | cart: item count, `setOpen` |
| `ProductBreadcrumb` | Home › category › product                                         | `productName`, `categories`                                    | —                           |
| `ProductDetails`    | The hero; owns the variation selection                            | `product`, `rating?`                                           | tracks `product_viewed`     |
| `ProductGallery`    | Main image (zoom, fade, arrow keys), thumbnails, share, wishlist  | `productId`, `productName`, `images`, `activeImage?`           | wishlist                    |
| `ProductInfo`       | Title, price, stock line, description, variations, quantity, CTAs | `product`, `selection` (from `useProductSelection`), `rating?` | cart: `addItem`, `setOpen`  |
| `CartDrawer`        | Slide-out cart                                                    | `className`                                                    | cart (all)                  |
| `ProductGrid`       | Titled product grid (2 / 3 / 5 columns)                           | `title`, `products`                                            | —                           |
| `ProductReviews`    | Summary, filters, tabs, list, pagination                          | `reviews`, `summary`                                           | —                           |
| `ReviewFilters`     | Rating + topic checkboxes (sidebar or mobile sheet)               | `ratings`, `topics`, `onRatingsChange`, `onTopicsChange`       | —                           |
| `SiteFooter`        | Newsletter, links, language and currency selectors                | footer props                                                   | preferences                 |

```tsx
// ProductDetails is the one entry point for the hero:
<ProductDetails product={product} rating={summary.average} />

<ProductGrid title={t("related")} products={getMockData(locale).products} />
<ProductReviews reviews={reviews} summary={summarizeReviews(reviews)} />
<CartDrawer /> // open state lives in the cart store
```

## Layouts

| Component       | Purpose                                                         |
| --------------- | --------------------------------------------------------------- |
| `PageContainer` | The 1200px content column with a 20px gutter (`max-w-310 px-5`) |

## Hooks components rely on

| Hook                           | Returns                                                                                                                                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useProductSelection(product)` | `selections`, `select`, the ready-to-render `options`, `price`, `inStock`, `stock` (`in_stock` · `low_stock` + `left` · `out_of_stock`), `maxQuantity`, `selectionImage`, `cartInput` (`null` until complete) |
| `useFormatPrice()`             | `(usd) => string` in the shopper's currency and language. Only `Price` calls it                                                                                                                               |
| `useCountdown(seconds)`        | The remaining time as `mm:ss` (`h:mm:ss` past an hour), restarting when `seconds` changes                                                                                                                     |
| `useVariationLabel()`          | `(name) => string`: the translated variation name, or the raw name when unknown                                                                                                                               |
