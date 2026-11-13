import { screen } from "@testing-library/react";

import { createTestQueryClient, renderWithProviders } from "@/test/render";
import { exchangeRatesQueryOptions } from "@integration/services/rates";
import { usePreferencesStore } from "@store/preferences";

import { Price } from "./Price";

const seededClient = () => {
  const queryClient = createTestQueryClient();
  queryClient.setQueryData(exchangeRatesQueryOptions("USD").queryKey, {
    result: "success",
    base_code: "USD",
    rates: { USD: 1, EGP: 50 },
    time_last_update_utc: "",
  });
  return queryClient;
};

describe("Price", () => {
  it("shows USD by default", () => {
    renderWithProviders(<Price amount={160} />);
    expect(screen.getByText("$160")).toBeInTheDocument();
  });

  it("converts to EGP with the cached rate", () => {
    usePreferencesStore.setState({ currency: "EGP" });
    renderWithProviders(<Price amount={160} />, {
      queryClient: seededClient(),
    });
    expect(screen.getByText(/^EGP\s8,000$/)).toBeInTheDocument();
  });

  it("formats for Arabic with Western digits", () => {
    usePreferencesStore.setState({ currency: "EGP" });
    renderWithProviders(<Price amount={160} />, {
      locale: "ar",
      queryClient: seededClient(),
    });
    expect(screen.getByText(/8,000/)).toHaveTextContent("ج.م");
  });
});
