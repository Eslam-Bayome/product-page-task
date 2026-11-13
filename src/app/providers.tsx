import { useLayoutEffect } from "react";
import { IntlProvider } from "use-intl";

import { DIRECTION, INTL_LOCALE, MESSAGES } from "@/i18n";
import { Toaster } from "@components/ui/sonner";
import { QueryProvider } from "@integration/api/tanstack/query-provider";
import { selectLocale, usePreferencesStore } from "@store/preferences";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  const locale = usePreferencesStore(selectLocale);

  // Mirror the locale onto <html> before paint so Arabic never flashes LTR.
  useLayoutEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = DIRECTION[locale];
  }, [locale]);

  return (
    <QueryProvider>
      <IntlProvider
        locale={INTL_LOCALE[locale]}
        messages={MESSAGES[locale]}
        // Review dates are authored in UTC; show them as written.
        timeZone="UTC"
      >
        {children}
        {/* Centred so toasts never cover the cart drawer, which opens at the end edge. */}
        <Toaster position="top-center" dir={DIRECTION[locale]} />
      </IntlProvider>
    </QueryProvider>
  );
};

export { Providers };
