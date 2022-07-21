import { dateFormat, categoryFormat, timeFormat } from "../pages/Home/HomePage";
import { renderNoRecords, generate3ExpensesLR } from "../pages/Home/HomePage";
import renderer from "react-test-renderer";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

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
test("Table view renders no records yet if empty database", () => {
  const expenses = [];
  const tree = renderer.create(
    expenses.length !== 0
      ? expenses.map((doc) => generate3ExpensesLR(doc))
      : renderNoRecords()
  );
  expect(tree).toMatchSnapshot();
});

// generate3ExpensesLR
test("expenses renders correctly with data", () => {
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
  const ex = () => {
    expenses.map((doc) => generate3ExpensesLR(doc));
  };
  const Stack = createStackNavigator();
  const MockNavigator = (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MockedScreen" component={ex} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  jest.mock("@react-navigation/native", () => {
    const actualNav = jest.requireActual("@react-navigation/native");
    return {
      ...actualNav,
      useNavigation: () => ({
        navigate: jest.fn(),
        dispatch: jest.fn(),
      }),
    };
  });
  const tree = renderer
    .create(
      expenses.length !== 0
        ? expenses.map((doc) => generate3ExpensesLR(doc))
        : renderNoRecords()
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

expenseArrayTimeConverted = [
  {
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
    value: 10,
  },
  {
    category: "transportation",
    date: {
      nanoseconds: 271000000,
      seconds: 1658388773,
    },
    key: "ZWcspIIBTGGdrF7SG9wf",
    notes: "",
    time: {
      nanoseconds: 0,
      seconds: 1658376053,
    },
    value: 15.55,
  },
  {
    category: "food and drinks",
    date: {
      nanoseconds: 328000000,
      seconds: 1658331027,
    },
    key: "2hxBUn7RvQwg99pSq8Aj",
    notes: "",
    time: {
      nanoseconds: 328000000,
      seconds: 1658331027,
    },
    value: 12,
  },
  {
    category: "education",
    date: {
      nanoseconds: 0,
      seconds: 1658229345,
    },
    key: "fCyTvlqG6ymIrvqjNRz1",
    notes: "",
    time: {
      nanoseconds: 174000000,
      seconds: 1658315745,
    },
    value: 20,
  },
  {
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
  },
  {
    category: "food and drinks",
    date: {
      nanoseconds: 0,
      seconds: 1658036981,
    },
    key: "eka9wiAzI1Dvzf3BLo6k",
    notes: "",
    time: {
      nanoseconds: 0,
      seconds: 1658191781,
    },
    value: 1.79,
  },
  {
    category: "others",
    date: {
      nanoseconds: 195000000,
      seconds: 1657744387,
    },
    key: "Ruvwoyeur91Ww87yeb7L",
    notes: "",
    time: {
      nanoseconds: 195000000,
      seconds: 1657744387,
    },
    value: 0.45,
  },
  {
    category: "food and drinks",
    date: {
      nanoseconds: 825000000,
      seconds: 1657743891,
    },
    key: "l3Q90QTVFMWpExKGL9LE",
    notes: "",
    time: {
      nanoseconds: 825000000,
      seconds: 1657743891,
    },
    value: 0.43,
  },
  {
    category: "shopping",
    date: {
      nanoseconds: 673000000,
      seconds: 1656912459,
    },
    key: "RFJNtPN7zq8RwWQL4RcJ",
    notes: "",
    time: {
      nanoseconds: 619000000,
      seconds: 1658122059,
    },
    value: 12.22,
  },
  {
    category: "shopping",
    date: {
      nanoseconds: 576000000,
      seconds: 1656080421,
    },
    key: "WjLx5SQnTHjKxxKfn4NW",
    notes: "Uniqlo",
    time: {
      nanoseconds: 278000000,
      seconds: 1656080421,
    },
    value: 12,
  },
  {
    category: "health",
    date: {
      nanoseconds: 121000000,
      seconds: 1655968071,
    },
    key: "UXhKu3Nk5nOi6PdeHMt2",
    notes: "uhc",
    time: {
      nanoseconds: 0,
      seconds: 1655924871,
    },
    value: 12,
  },
  {
    category: "transportation",
    date: {
      nanoseconds: 68000000,
      seconds: 1655699341,
    },
    key: "8fvXByUNztNXUYtf1kBT",
    notes: "Top up card",
    time: {
      nanoseconds: 68000000,
      seconds: 1655699341,
    },
    value: 20,
  },
  {
    category: "others",
    date: {
      nanoseconds: 668000000,
      seconds: 1652885839,
    },
    key: "yYbJvvhXz7zkQbxVZB4B",
    notes: "",
    time: {
      nanoseconds: 654000000,
      seconds: 1652885839,
    },
    value: 20.5,
  },
  {
    category: "housing",
    date: {
      nanoseconds: 0,
      seconds: 1624641464,
    },
    key: "4eJR7VhR4UjotkVWeYyo",
    notes: "",
    time: {
      nanoseconds: 657000000,
      seconds: 1656177464,
    },
    value: 100,
  },
  {
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
  },
];
