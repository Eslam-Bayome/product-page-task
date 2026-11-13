import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { IntlProvider } from "use-intl";

import { INTL_LOCALE, MESSAGES } from "@/i18n";
import { Toaster } from "@components/ui/sonner";
import { type Locale, usePreferencesStore } from "@store/preferences";

type Options = {
  locale?: Locale;
  queryClient?: QueryClient;
};

export const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

/**
 * Renders `ui` with the app's providers: a fresh QueryClient, real messages
 * for `locale` (also written to the preferences store) and the Toaster.
 */
export const renderWithProviders = (
  ui: React.ReactElement,
  { locale = "en", queryClient = createTestQueryClient() }: Options = {},
) => {
  usePreferencesStore.setState({ locale });
  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <IntlProvider
          locale={INTL_LOCALE[locale]}
          messages={MESSAGES[locale]}
          timeZone="UTC"
        >
          {ui}
          <Toaster />
        </IntlProvider>
      </QueryClientProvider>,
    ),
  };
};
