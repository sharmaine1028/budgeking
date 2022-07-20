import { renderNoGoals } from "../pages/Goal/GoalsPage";
import renderer from "react-test-renderer";
import GenerateGoal from "../pages/Goal/GenerateGoal";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

test("goal renders correctly if empty database", async () => {
  const goals = [];
  const tree = renderer.create(
    goals.length !== 0
      ? goals.map((doc) => (
          <GenerateGoal
            key={doc.id}
            doc={doc}
            time={"short term"}
            deleteItem={this.deleteGoal}
            saveItem={this.saveToGoal}
            editItem={this.editGoal}
          />
        ))
      : renderNoGoals()
  );
  expect(tree).toMatchSnapshot();
});

test("goal renders correctly with data", async () => {
  const Stack = createStackNavigator();
  const MockNavigator = (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MockedScreen" component={GenerateGoal} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  const goals = [
    (item = {
      id: 0,
      createdBy: "ywyztcPj3QcuDAahB9ZSGlBi2Ow2",
      createdByEmail: "a@gmail.com",
      currSavingsAmt: 5,
      dateCreated: new Date(2022, 7, 12, 20, 37, 13),
      deadline: new Date(2022, 7, 31, 23, 59, 59),
      freqAmount: "0.42",
      frequency: "Daily",
      goalDescription: "apples",
      isOffTrack: false,
      isSharing: true,
      notes: "",
      sharingEmails: ["b@gmail.com"],
      target: 10,
    }),
  ];

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
      goals.length !== 0
        ? goals.map((doc) => (
            <GenerateGoal key={doc.id} doc={doc} time={"short term"} />
          ))
        : renderNoGoals()
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
