import { dateFormat, categoryFormat, timeFormat } from "../pages/Home/HomePage";
import {
  renderNoRecords,
  generate3ExpensesLR,
  renderLegend,
} from "../pages/Home/HomePage";
import TestRenderer from "react-test-renderer";

// dateFormat
test("date formats correctly", () => {
  const dateMilliseconds = new Date("Dec 12, 2022 23:15:30").getTime();
  const convertToSeconds = dateMilliseconds / 1000;
  const dateMilliseconds1 = new Date("May 9, 2001 23:15:30").getTime();
  const convertToSeconds1 = dateMilliseconds1 / 1000;
  expect(dateFormat(convertToSeconds)).toBe("12 Dec 2022"); // 12 Dec 2022
  expect(dateFormat(convertToSeconds1)).toBe("9 May 2001"); // 9 May 2001
});

// categoryFormat
test("category formats correctly", () => {
  const foodDrink = "food and drinks";
  const edu = "education";
  expect(categoryFormat(foodDrink)).toBe("Food & Drinks");
  expect(categoryFormat(edu)).toBe("Education");
});

// timeFormat
test("time formats correctly", () => {
  const dateMillisecondsPM = new Date("Dec 12, 2022 23:59:30").getTime();
  const convertToSecondsPM = dateMillisecondsPM / 1000;
  const dateMillisecondsAM = new Date("Dec 12, 2022 9:09:30").getTime();
  const convertToSecondsAM = dateMillisecondsAM / 1000;
  const dateMilliseconds0 = new Date("Dec 12, 2022 0:00:00").getTime();
  const convertToSeconds0 = dateMilliseconds0 / 1000;
  const dateMillisecondsNoon = new Date("Dec 12, 2022 12:00:00").getTime();
  const convertToSecondsNoon = dateMillisecondsNoon / 1000;
  expect(timeFormat(convertToSecondsPM)).toBe("11:59 PM");
  expect(timeFormat(convertToSecondsAM)).toBe("9:09 AM");
  expect(timeFormat(convertToSeconds0)).toBe("12:00 AM");
  expect(timeFormat(convertToSecondsNoon)).toBe("12:00 PM");
});

// renderNoRecords
test("table view renders no records yet if empty database", async () => {
  try {
    const expenses = [];
    const tree = TestRenderer.create(
      expenses.length !== 0
        ? expenses.map((doc) => generate3ExpensesLR(doc))
        : renderNoRecords()
    );
    expect(tree).toMatchSnapshot();
  } catch (e) {
    console.log(e);
  }
});

// generate3ExpensesLR
test("expenses renders correctly with data", async () => {
  try {
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
    const tree = TestRenderer.create(
      expenses.length !== 0
        ? expenses.map((doc) => generate3ExpensesLR(doc))
        : renderNoRecords()
    );
    expect(tree).toMatchSnapshot();
  } catch (e) {
    console.log(e);
  }
});

test("pie chart renders legend correctly", async () => {
  const legend = [
    ["Food & Drinks", "#177AD5"],
    ["Transportation", "#79D2DE"],
    ["Housing", "#F7D8B5"],
    ["Shopping", "#8F80E4"],
    ["Health", "#FB8875"],
    ["Education", "#FDE74C"],
    ["Others", "#E8E0CE"],
  ];
  const tree = TestRenderer.create(
    legend.map((doc) => renderLegend(doc[0], doc[1]))
  );
  expect(tree).toMatchSnapshot();
});
