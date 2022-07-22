import { addExpensesIncomeAllTime } from "../pages/Report/ReportsPage";
import {
  getDailyData,
  getMonthlyData,
  getYearlyData,
} from "../pages/Report/ReportsPageTable";
import { dateFormat } from "../pages/Home/HomePage";

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

// addExpensesIncomeAllTime
test("addExpensesIncome adds expenses and income correctly", () => {
  const add = 10.5 + 60 + 12.78;
  expect(addExpensesIncomeAllTime(expenses)).toEqual(add.toFixed(2));
});

// getDailyData
test("getDailyData filters correct data", () => {
  const thisDate = dateFormat(new Date().getTime() / 1000);
  if (
    thisDate == "21 Jul 2022" ||
    thisDate == "18 Jul 2022" ||
    thisDate == "20 Jun 2021"
  ) {
    expect(getDailyData(expenses).length).toEqual(1);
  }
  expect(getDailyData(expenses).length).toEqual(0);
});

// getMonthlyData
test("getMonthlyData filters correct data", () => {
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  if (thisMonth == 6 && thisYear == 2022) {
    expect(getMonthlyData(expenses).length).toEqual(2);
  } else if (thisMonth == 5 && thisYear == 2021) {
    expect(getMonthlyData(expenses).length).toEqual(1);
  } else {
    expect(getMonthlyData(expenses).length).toEqual(0);
  }
});

// getYearlyData
test("getYearlyData filters correct data", () => {
  const thisYear = new Date().getFullYear();
  if (thisYear == 2022) {
    expect(getYearlyData(expenses).length).toEqual(2);
  } else if (thisYear == 2021) {
    expect(getYearlyData(expenses).length).toEqual(1);
  } else {
    expect(getYearlyData(expenses).length).toEqual(0);
  }
});
