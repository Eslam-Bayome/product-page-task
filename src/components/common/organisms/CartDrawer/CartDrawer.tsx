import { toast } from "sonner";
import { useTranslations } from "use-intl";
import { useShallow } from "zustand/react/shallow";

import bagIcon from "@/assets/icons/bag.svg";
import { DIRECTION } from "@/i18n";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@components/ui/sheet";
import { analytics } from "@integration/analytics";
import { cn } from "@lib/utils";
import {
  selectIsOpen,
  selectItemCount,
  selectItems,
  selectRemoveItem,
  selectSavings,
  selectSetOpen,
  selectSubtotal,
  selectUpdateQuantity,
  useCartStore,
} from "@store/cart";
import { selectLocale, usePreferencesStore } from "@store/preferences";

import { type CartDrawerProps } from "./CartDrawer.types";
import { Button } from "../../atoms/Button";
import { Price } from "../../atoms/Price";
import { Typography } from "../../atoms/Typography";
import { CartLineItem } from "../../molecules/CartLineItem";
import { SheetCloseButton } from "../../molecules/SheetCloseButton";

/**
 * Slide-out cart bound to the cart store. Not in the Figma file, so it is
 * composed from the design's tokens and existing molecules only.
 */
function CartDrawer({ className }: CartDrawerProps) {
  const t = useTranslations("cart");
  const locale = usePreferencesStore(selectLocale);
  const isOpen = useCartStore(selectIsOpen);
  const setOpen = useCartStore(selectSetOpen);
  const items = useCartStore(useShallow(selectItems));
  const itemCount = useCartStore(selectItemCount);
  const subtotal = useCartStore(selectSubtotal);
  const savings = useCartStore(selectSavings);
  const updateQuantity = useCartStore(selectUpdateQuantity);
  const removeItem = useCartStore(selectRemoveItem);

  // The sheet slides in from the inline end: right in LTR, left in RTL.
  const side = DIRECTION[locale] === "rtl" ? "left" : "right";

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        side={side}
        showCloseButton={false}
        className={cn("w-full gap-0 sm:max-w-md", className)}
      >
        <SheetCloseButton />
        <SheetHeader className="ps-5 pe-12 pt-6 pb-4 lg:ps-6">
          <SheetTitle asChild>
            <Typography as="h2" variant="title" tone="heading">
              {itemCount > 0
                ? t("titleWithCount", { count: itemCount })
                : t("title")}
            </Typography>
          </SheetTitle>
          <SheetDescription className="sr-only">
            {t("description")}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 text-center">
            <img src={bagIcon} alt="" className="size-10 opacity-40" />
            <Typography variant="title" tone="heading">
              {t("emptyTitle")}
            </Typography>
            <Typography tone="muted">{t("emptyBody")}</Typography>
            <Button variant="outline" size="lg" onClick={() => setOpen(false)}>
              {t("continueShopping")}
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-5 lg:px-6">
              {items.map((item) => (
                <CartLineItem
                  key={item.lineId}
                  name={item.name}
                  imageUrl={item.image}
                  options={item.options}
                  unitPrice={item.unitPrice}
                  compareAtPrice={item.compareAtPrice}
                  quantity={item.quantity}
                  maxQuantity={item.maxQuantity}
                  onQuantityChange={(quantity) =>
                    updateQuantity(item.lineId, quantity)
                  }
                  onRemove={() => {
                    removeItem(item.lineId);
                    analytics.track("cart_item_removed", {
                      product_id: item.productId,
                      variant_id: item.variantId,
                    });
                  }}
                />
              ))}
            </ul>

            <SheetFooter className="gap-4 border-t border-border px-5 py-6 lg:px-6">
              <dl className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Typography as="dt" tone="muted">
                    {t("subtotal")}
                  </Typography>
                  <dd>
                    <Price amount={subtotal} size="md" />
                  </dd>
                </div>
                {savings > 0 && (
                  <div className="flex items-center justify-between text-success">
                    <Typography as="dt" tone="inherit">
                      {t("savings")}
                    </Typography>
                    <dd>
                      <Price
                        amount={savings}
                        size="md"
                        className="text-success"
                      />
                    </dd>
                  </div>
                )}
              </dl>
              <Button
                size="xl"
                fullWidth
                onClick={() => {
                  analytics.track("checkout_started", {
                    item_count: itemCount,
                    subtotal_usd: subtotal,
                  });
                  toast.info(t("checkoutUnavailable"));
                }}
              >
                {t("checkout")}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export { CartDrawer };
