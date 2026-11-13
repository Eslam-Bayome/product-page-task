/* eslint-disable no-console -- printing the events is this provider's job */
import type { AnalyticsProvider, EventMap } from "../types";

/** For local dev: prints `[analytics] <event>` in the browser console. */
export const consoleProvider = <
  Events extends EventMap<Events>,
>(): AnalyticsProvider<Events> => ({
  init: () => {},
  track: (event, props) => console.info(`[analytics] ${event}`, props),
});
