import { act, renderHook } from "@testing-library/react";

import { formatCountdown, useCountdown } from "./use-countdown";

describe("formatCountdown", () => {
  it("formats minutes and hours", () => {
    expect(formatCountdown(20 * 60 + 40)).toBe("20:40");
    expect(formatCountdown(5)).toBe("00:05");
    expect(formatCountdown(3600)).toBe("1:00:00");
  });
});

describe("useCountdown", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("ticks down each second and restarts at zero", () => {
    const { result } = renderHook(() => useCountdown(2));
    expect(result.current).toBe("00:02");

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current).toBe("00:01");

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current).toBe("00:02");
  });
});
