import type {
  AnalyticsProvider,
  EventMap,
  EventName,
  ProviderFactory,
} from "./types";

/**
 * `createProvider` returning `null` turns analytics off. It runs once, on the
 * first call, so nothing has to initialise it from a root effect.
 * `getSuperProps` is read on every call and merged into the event, so call
 * sites never pass session-wide values themselves.
 */
export const createAnalytics = <
  Events extends EventMap<Events>,
  Super extends object,
>(
  createProvider: ProviderFactory<Events>,
  getSuperProps: () => Super,
) => {
  let providerReady: Promise<AnalyticsProvider<Events> | null> | undefined;

  const getProvider = () => {
    providerReady ??= Promise.resolve()
      .then(createProvider)
      .then((provider) => {
        provider?.init();
        return provider;
      });
    return providerReady;
  };

  return {
    /** Fire-and-forget: a blocked script or vendor outage never breaks the
     *  shopper's action, and calls queue on one promise, so they arrive in
     *  order. Never `await` it or wrap it in `try`. */
    track: <E extends EventName<Events>>(event: E, props: Events[E]) => {
      // Super props are read now, not when the provider is ready.
      const merged = { ...getSuperProps(), ...props };
      getProvider()
        .then((provider) => provider?.track(event, merged))
        .catch((error: unknown) => console.warn("[analytics]", error));
    },
  };
};
