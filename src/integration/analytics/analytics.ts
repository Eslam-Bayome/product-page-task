import { ANALYTICS_MODE, MIXPANEL_TOKEN } from "@config/env";
import { usePreferencesStore } from "@store/preferences";

import { createAnalytics } from "./create-analytics";
import type { AnalyticsEvents, SuperProperties } from "./events";
import { consoleProvider } from "./providers/console";

/** The typed `analytics` every call site imports. */
export const analytics = createAnalytics<AnalyticsEvents, SuperProperties>(
  async () => {
    switch (ANALYTICS_MODE) {
      case "mixpanel": {
        if (!MIXPANEL_TOKEN) return null;
        const { mixpanelProvider } = await import("./providers/mixpanel");
        return mixpanelProvider<AnalyticsEvents>(MIXPANEL_TOKEN);
      }
      case "console":
        return consoleProvider<AnalyticsEvents>();
      default:
        return null;
    }
  },
  () => {
    const { locale, currency } = usePreferencesStore.getState();
    return { language: locale, currency };
  },
);
