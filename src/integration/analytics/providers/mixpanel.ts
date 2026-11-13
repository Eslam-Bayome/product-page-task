// The core build: the default entry bundles the session-replay recorder,
// which we never enable.
import mixpanel, { type Config } from "mixpanel-browser/dist/mixpanel-core.cjs";

import type { AnalyticsProvider, EventMap } from "../types";

const DEFAULT_CONFIG: Partial<Config> = {
  persistence: "localStorage",
  // Every event is sent explicitly; nothing implicit may capture input values.
  track_pageview: false,
  autocapture: false,
};

/** Import only through a dynamic `import()` (see `analytics.ts`), so the SDK
 *  stays in its own chunk and a disabled mode never downloads it. */
export const mixpanelProvider = <Events extends EventMap<Events>>(
  token: string,
): AnalyticsProvider<Events> => ({
  init: () => mixpanel.init(token, DEFAULT_CONFIG),
  track: (event, props) => mixpanel.track(event, props),
});
