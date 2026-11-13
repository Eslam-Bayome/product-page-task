import { render, screen } from "@testing-library/react";
import { useTranslations } from "use-intl";

import { usePreferencesStore } from "@store/preferences";

import { Providers } from "./providers";

const AddToCartLabel = () => {
  const t = useTranslations("product");
  return <span>{t("addToCart")}</span>;
};

it("switches the document to Arabic, right-to-left", () => {
  usePreferencesStore.setState({ locale: "ar" });
  render(
    <Providers>
      <AddToCartLabel />
    </Providers>,
  );

  expect(document.documentElement).toHaveAttribute("lang", "ar");
  expect(document.documentElement).toHaveAttribute("dir", "rtl");
  expect(screen.getByText("أضف إلى السلة")).toBeInTheDocument();
});
