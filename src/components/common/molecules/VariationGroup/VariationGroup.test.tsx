import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithProviders } from "@/test/render";

import { VariationGroup } from "./VariationGroup";

const options = [
  { value: "38", label: "38" },
  { value: "40", label: "40", disabled: true },
  { value: "42", label: "42" },
];

describe("VariationGroup", () => {
  it("disables unavailable options and reports the pick", async () => {
    const onValueChange = vi.fn();
    renderWithProviders(
      <VariationGroup
        name="Size"
        type="button"
        options={options}
        value={undefined}
        onValueChange={onValueChange}
      />,
    );

    expect(screen.getByText("Select")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "40" })).toBeDisabled();

    await userEvent.click(screen.getByRole("radio", { name: "42" }));
    expect(onValueChange).toHaveBeenCalledWith("42");
  });

  it("keeps the selection when the active option is clicked again", async () => {
    const onValueChange = vi.fn();
    renderWithProviders(
      <VariationGroup
        name="Size"
        type="button"
        options={options}
        value="38"
        onValueChange={onValueChange}
      />,
    );

    await userEvent.click(screen.getByRole("radio", { name: "38" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
