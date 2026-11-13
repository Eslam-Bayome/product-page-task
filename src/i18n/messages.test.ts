import ar from "@messages/ar.json";
import en from "@messages/en.json";

const keys = (value: unknown, prefix = ""): string[] =>
  value && typeof value === "object"
    ? Object.entries(value).flatMap(([key, child]) =>
        keys(child, prefix ? `${prefix}.${key}` : key),
      )
    : [prefix];

it("keeps en.json and ar.json in sync", () => {
  expect(keys(ar).sort()).toEqual(keys(en).sort());
});
