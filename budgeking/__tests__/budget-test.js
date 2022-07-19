import React from "react";
import { dateFormat, timeFormat } from "../pages/Budget/BudgetPage";

// Date Format
test("date formats correctly", () => {
  const date = new Date(2022, 11, 12, 6, 5, 46, 2);
  expect(dateFormat(date)).toBe("12 Nov 2022");
});

// Time Format
test("time formats correctly", () => {
  const time = new Date(2022, 11, 12, 6, 5, 46, 2);
  expect(timeFormat(date)).toBe("6:05");
});
