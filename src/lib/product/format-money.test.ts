import { formatMoney } from "./format-money";

describe("formatMoney", () => {
  it("formats per currency and locale", () => {
    expect(formatMoney(160, "USD", "en-US")).toBe("$160");
    // Intl separates the code with a non-breaking space.
    expect(formatMoney(8551.8, "EGP", "en-US")).toMatch(/^EGP\s8,551\.8$/);
  });

  it("keeps Western digits in Arabic", () => {
    const arabic = formatMoney(8551.8, "EGP", "ar-EG-u-nu-latn");
    expect(arabic).toMatch(/8,551\.8/);
    expect(arabic).toMatch(/ج\.م/);
  });
});
