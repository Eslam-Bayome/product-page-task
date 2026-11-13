import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "use-intl";

import chevronWhiteIcon from "@/assets/icons/chevron-white.svg";
import emailIcon from "@/assets/icons/email.svg";
import facebookIcon from "@/assets/icons/facebook.svg";
import flagEgIcon from "@/assets/icons/flag-eg.svg";
import flagUsIcon from "@/assets/icons/flag-us.svg";
import instagramIcon from "@/assets/icons/instagram.svg";
import twitterIcon from "@/assets/icons/twitter.svg";
import logo from "@/assets/logo.png";
import { analytics } from "@integration/analytics";
import { exchangeRatesQueryOptions } from "@integration/services/rates";
import { cn } from "@lib/utils";
import {
  type DisplayCurrency,
  type Locale,
  selectCurrency,
  selectLocale,
  selectSetCurrency,
  selectSetLocale,
  usePreferencesStore,
} from "@store/preferences";

import { type SiteFooterProps } from "./SiteFooter.types";
import { DashedDivider } from "../../atoms/DashedDivider";
import { PageContainer } from "../../layouts/PageContainer";
import { OptionSelect } from "../../molecules/OptionSelect";

const SOCIALS = [
  { key: "facebook", icon: facebookIcon },
  { key: "instagram", icon: instagramIcon },
  { key: "twitter", icon: twitterIcon },
  { key: "email", icon: emailIcon },
] as const;

// Full message keys, so every link is type-checked against en.json.
const COLUMNS = [
  {
    key: "shop",
    links: [
      "columns.shop.links.account",
      "columns.shop.links.login",
      "columns.shop.links.wishlist",
      "columns.shop.links.cart",
    ],
  },
  {
    key: "information",
    links: [
      "columns.information.links.shipping",
      "columns.information.links.returns",
      "columns.information.links.cookies",
      "columns.information.links.faq",
    ],
  },
  {
    key: "company",
    links: [
      "columns.company.links.about",
      "columns.company.links.privacy",
      "columns.company.links.terms",
      "columns.company.links.contact",
    ],
  },
] as const;

const LOCALES = ["en", "ar"] as const;
const CURRENCIES = ["USD", "EGP"] as const;
const FLAGS: Record<Locale, string> = { en: flagUsIcon, ar: flagEgIcon };

/**
 * Newsletter, socials, link columns, copyright and the language / currency
 * selectors (Figma 57:3766 / 62:1766).
 */
function SiteFooter({ className, ...props }: SiteFooterProps) {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");
  const queryClient = useQueryClient();
  const locale = usePreferencesStore(selectLocale);
  const currency = usePreferencesStore(selectCurrency);
  const setLocale = usePreferencesStore(selectSetLocale);
  const setCurrency = usePreferencesStore(selectSetCurrency);

  const subscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();
    toast.success(t("subscribed"));
    analytics.track("newsletter_subscribed", {});
  };

  const changeLocale = (next: Locale) => {
    setLocale(next);
    analytics.track("language_changed", { language: next });
  };

  // Switch only once the rate is in, so prices never claim EGP while showing USD.
  const changeCurrency = async (next: DisplayCurrency) => {
    try {
      if (next !== "USD") {
        await queryClient.fetchQuery(exchangeRatesQueryOptions("USD"));
      }
      setCurrency(next);
      analytics.track("currency_changed", { currency: next });
    } catch {
      toast.error(t("rateFailed"));
    }
  };

  return (
    <footer
      className={cn("bg-muted pt-15.5 pb-5.5 lg:pt-18 lg:pb-6.5", className)}
      {...props}
    >
      <PageContainer>
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-0">
          <div className="flex flex-col lg:w-77.5">
            <img src={logo} alt={tCommon("logoAlt")} className="h-8 w-42.5" />
            <form onSubmit={subscribe} className="mt-10 flex flex-col">
              <div className="flex items-center gap-8">
                <label htmlFor="newsletter-email" className="sr-only">
                  {t("emailLabel")}
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={t("newsletterPlaceholder")}
                  className="w-53.5 bg-transparent text-16 leading-relaxed font-medium tracking-wide text-foreground outline-none placeholder:text-placeholder"
                />
                <button
                  type="submit"
                  aria-label={t("subscribe")}
                  className="rounded-md bg-primary px-4 py-2 lg:rounded-lg"
                >
                  <img
                    src={chevronWhiteIcon}
                    alt=""
                    className="size-5 rotate-90 rtl:-rotate-90"
                  />
                </button>
              </div>
              <span aria-hidden className="h-[0.5px] w-74.5 bg-foreground" />
            </form>
            <ul className="mt-5.75 flex gap-4 lg:mt-4">
              {SOCIALS.map((social) => (
                <li key={social.key}>
                  <a
                    href="#"
                    aria-label={t(`socials.${social.key}`)}
                    className="flex size-9 items-center justify-center rounded-full bg-background"
                  >
                    <img src={social.icon} alt="" className="size-4.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav
            aria-label={t("label")}
            className="flex flex-wrap gap-x-14.5 gap-y-6.25 lg:flex-nowrap lg:gap-x-30"
          >
            {COLUMNS.map((column) => (
              <div key={column.key} className="flex w-33.5 flex-col gap-4">
                <h2 className="h-5.5 text-18 leading-6 font-medium text-footer-foreground lg:text-14 lg:font-semibold">
                  {t(`columns.${column.key}.title`)}
                </h2>
                <ul className="flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link} className="flex">
                      <a
                        href="#"
                        className="text-14 leading-5.5 text-footer-muted hover:underline lg:text-foreground"
                      >
                        {t(link)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <DashedDivider className="mt-8.25 lg:mt-18 lg:h-px" />
        <div className="flex flex-col pt-9 lg:flex-row lg:items-start lg:justify-between lg:pt-6">
          <p className="text-14 leading-5.5 text-footer-muted">
            {t("copyright")}
          </p>
          <div className="mt-6.25 flex items-center gap-4 self-end lg:mt-0 lg:gap-8 lg:pe-1">
            <OptionSelect<Locale>
              label={t("language")}
              value={locale}
              onValueChange={changeLocale}
              options={LOCALES.map((value) => ({
                value,
                label: t(`languages.${value}`),
                iconUrl: FLAGS[value],
              }))}
            />
            <OptionSelect<DisplayCurrency>
              label={t("currency")}
              value={currency}
              onValueChange={(next) => void changeCurrency(next)}
              options={CURRENCIES.map((value) => ({
                value,
                label: t(`currencies.${value}`),
              }))}
            />
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}

export { SiteFooter };
