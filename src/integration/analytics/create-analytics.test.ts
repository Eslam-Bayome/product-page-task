import { createAnalytics } from "./create-analytics";
import type { AnalyticsProvider } from "./types";

type Events = { a: { n: number }; b: { s: string } };

const flush = () => new Promise((resolve) => setTimeout(resolve));

const fakeProvider = () => {
  const sent: Array<[string, object]> = [];
  const provider: AnalyticsProvider<Events> = {
    init: vi.fn(),
    track: (event, props) => sent.push([event, props]),
  };
  return { provider, sent };
};

it("sends events in order with the super properties merged in", async () => {
  const { provider, sent } = fakeProvider();
  let language = "en";
  const analytics = createAnalytics<Events, { language: string }>(
    async () => provider,
    () => ({ language }),
  );

  analytics.track("a", { n: 1 });
  language = "ar";
  analytics.track("b", { s: "x" });
  await flush();

  expect(provider.init).toHaveBeenCalledOnce();
  expect(sent).toEqual([
    ["a", { language: "en", n: 1 }],
    ["b", { language: "ar", s: "x" }],
  ]);
});

it("sends nothing when the provider is off", async () => {
  const createProvider = vi.fn(() => null);
  const analytics = createAnalytics<Events, object>(createProvider, () => ({}));

  analytics.track("a", { n: 1 });
  analytics.track("a", { n: 2 });
  await flush();

  expect(createProvider).toHaveBeenCalledOnce();
});

it("never throws when the provider fails", async () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  const analytics = createAnalytics<Events, object>(
    () => ({
      init: () => {},
      track: () => {
        throw new Error("blocked");
      },
    }),
    () => ({}),
  );

  expect(() => analytics.track("a", { n: 1 })).not.toThrow();
  await flush();
  expect(warn).toHaveBeenCalledWith("[analytics]", expect.any(Error));
  warn.mockRestore();
});
