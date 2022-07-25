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
  const time2 = new Date(2022, 11, 12, 16, 10, 46, 2);
  const time3 = new Date(2022, 11, 12, 12, 0, 0, 2);
  expect(timeFormat(time)).toBe("6:05");
  expect(timeFormat(time2)).toBe("16:10");
  expect(timeFormat(time3)).toBe("12:00");
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
