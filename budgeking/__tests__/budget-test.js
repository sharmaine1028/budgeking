import { timeFormat } from "../pages/Budget/BudgetPage";
import {
  AddBlackButton,
  CancelBlackButton,
} from "../components/reusableButton";
import { render, screen } from "@testing-library/react-native";
import * as React from "react";

// Time Format
test("time formats correctly", () => {
  const time = new Date(2022, 11, 12, 6, 5, 46, 2);
  expect(timeFormat(time)).toBe("6:05");
});

describe("testing budget components", () => {
  test("add button should render without throwing an error", async () => {
    render(<AddBlackButton />);
    const add = await screen.queryByText("Add");
    expect(add).toBeTruthy();
  });
  test("cancel button should render without throwing an error", async () => {
    render(<CancelBlackButton />);
    const cancel = await screen.queryByText("Cancel");
    expect(cancel).toBeTruthy();
  });
});
