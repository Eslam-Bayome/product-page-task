import { useTranslations } from "use-intl";

import bagIcon from "@/assets/icons/bag.svg";
import chevronIcon from "@/assets/icons/chevron.svg";
import heartIcon from "@/assets/icons/heart.svg";
import menuIcon from "@/assets/icons/menu.svg";
import searchIcon from "@/assets/icons/search.svg";
import userIcon from "@/assets/icons/user.svg";
import logo from "@/assets/logo.png";
import { cn } from "@lib/utils";
import { selectItemCount, selectSetOpen, useCartStore } from "@store/cart";

import { type SiteHeaderProps } from "./SiteHeader.types";
import { CountBadge } from "../../atoms/CountBadge";
import { DashedDivider } from "../../atoms/DashedDivider";
import { PageContainer } from "../../layouts/PageContainer";

const navText = "flex items-center gap-1 text-16 leading-relaxed font-medium";

/**
 * Logo and store actions (Figma 57:1307 / 79:688). Only the cart is wired;
 * search, categories, sign-in, wishlist and the mobile menu have no backend.
 */
function SiteHeader({ className, ...props }: SiteHeaderProps) {
  const t = useTranslations("header");
  const tCommon = useTranslations("common");
  const itemCount = useCartStore(selectItemCount);
  const setCartOpen = useCartStore(selectSetOpen);

  return (
    <header className={className} {...props}>
      <PageContainer>
        <div className="flex items-center justify-between py-6 lg:py-7.75">
          <a href="/" aria-label={tCommon("home")}>
            <img
              src={logo}
              alt=""
              className="h-6.5 w-35 object-cover lg:h-8 lg:w-42.5"
            />
          </a>
          <nav
            aria-label={t("store")}
            className="flex items-center gap-5 lg:gap-8"
          >
            <button type="button" aria-label={t("search")}>
              <img src={searchIcon} alt="" className="size-5" />
            </button>
            <button type="button" className={cn(navText, "max-lg:hidden")}>
              {t("categories")}
              <img src={chevronIcon} alt="" className="size-5 -scale-y-100" />
            </button>
            <button type="button" className={cn(navText, "max-lg:hidden")}>
              <img src={userIcon} alt="" className="size-5" />
              {t("signIn")}
            </button>
            <button
              type="button"
              aria-label={t("wishlist")}
              className="max-lg:hidden"
            >
              <img src={heartIcon} alt="" className="size-5" />
            </button>
            <button
              type="button"
              aria-label={t("cart", { count: itemCount })}
              onClick={() => setCartOpen(true)}
              className="relative"
            >
              <img src={bagIcon} alt="" className="size-5" />
              <CountBadge count={itemCount} />
            </button>
            <button type="button" aria-label={t("menu")} className="lg:hidden">
              <img src={menuIcon} alt="" className="size-5" />
            </button>
          </nav>
        </div>
        <DashedDivider />
      </PageContainer>
    </header>
  );
}

export { SiteHeader };
