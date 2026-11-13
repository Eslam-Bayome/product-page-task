import { getExchangeRatesAction } from "./get-exchange-rates.action";

const respond = (body: unknown, status = 200) =>
  vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(new Response(JSON.stringify(body), { status }));

afterEach(() => vi.restoreAllMocks());

describe("getExchangeRatesAction", () => {
  it("returns the rates for the base currency", async () => {
    const fetchSpy = respond({
      result: "success",
      base_code: "USD",
      rates: { USD: 1, EGP: 53.45 },
      time_last_update_utc: "Fri, 13 Nov 2026 00:02:31 +0000",
    });

    const { data, error } = await getExchangeRatesAction("USD");

    expect(error).toBeNull();
    expect(data?.rates.EGP).toBe(53.45);
    expect(String(fetchSpy.mock.calls[0]?.[0])).toBe(
      "https://open.er-api.com/v6/latest/USD",
    );
  });

  it("turns a `result: error` body into an ApiError", async () => {
    respond({ result: "error", "error-type": "unsupported-code" });

    const { data, error } = await getExchangeRatesAction("XXX");

    expect(data).toBeNull();
    expect(error?.message).toBe("unsupported-code");
  });
});
