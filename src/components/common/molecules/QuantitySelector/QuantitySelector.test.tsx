import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithProviders } from "@/test/render";

import { QuantitySelector } from "./QuantitySelector";

const setup = (value: number, max: number) => {
  const onChange = vi.fn();
  renderWithProviders(
    <QuantitySelector
      value={value}
      max={max}
      onChange={onChange}
      label="Shoes quantity"
    />,
  );
  return {
    onChange,
    decrease: screen.getByRole("button", { name: "Decrease Shoes quantity" }),
    increase: screen.getByRole("button", { name: "Increase Shoes quantity" }),
  };
};

describe("QuantitySelector", () => {
  it("disables the buttons at the bounds", () => {
    const { decrease, increase } = setup(1, 1);
    expect(decrease).toBeDisabled();
    expect(increase).toBeDisabled();
  });

  it("steps within [min, max]", async () => {
    const { onChange, decrease, increase } = setup(2, 3);
    await userEvent.click(increase);
    expect(onChange).toHaveBeenLastCalledWith(3);
    await userEvent.click(decrease);
    expect(onChange).toHaveBeenLastCalledWith(1);
  });
});
