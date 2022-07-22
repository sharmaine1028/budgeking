import { addExpensesIncomeAllTime } from "../pages/Report/ReportsPage";
import TestRenderer from "react-test-renderer";

test("addExpensesIncome adds expenses and income correctly", () => {
  const expenses = [
    (item = {
      category: "food and drinks",
      date: {
        nanoseconds: 591000000,
        seconds: 1658382053,
      },
      key: "VBjtiejjNZO2yLUV2nGj",
      notes: "",
      time: {
        nanoseconds: 591000000,
        seconds: 1658382053,
      },
      value: 10.5,
    }),
    (item = {
      category: "health",
      date: {
        nanoseconds: 868000000,
        seconds: 1658122274,
      },
      key: "lwX2I0eq9oYaWL01nbW3",
      notes: "Annual detailed checkup",
      time: {
        nanoseconds: 402000000,
        seconds: 1658179874,
      },
      value: 60,
    }),
    (item = {
      category: "health",
      date: {
        nanoseconds: 0,
        seconds: 1624202293,
      },
      key: "S10W60mbFClRQ2DZifxP",
      notes: "Uniqlo ",
      time: {
        nanoseconds: 0,
        seconds: 1655695093,
      },
      value: 12.78,
    }),
  ];
  const add = 10.5 + 60 + 12.78;
  expect(addExpensesIncomeAllTime(expenses)).toEqual(add.toFixed(2));
});
