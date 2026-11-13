/** A tracking plan: event name → its props. The self-reference lets the app
 *  pass plain interfaces, which have no index signature. */
export type EventMap<Events> = { [E in keyof Events]: object };

export type EventName<Events> = keyof Events & string;

/** The vendor contract, typed by the tracking plan. */
export interface AnalyticsProvider<Events extends EventMap<Events>> {
  init(): void;
  track<E extends EventName<Events>>(event: E, props: Events[E]): void;
}

export type ProviderFactory<Events extends EventMap<Events>> = () =>
  AnalyticsProvider<Events> | null | Promise<AnalyticsProvider<Events> | null>;
