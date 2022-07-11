import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Platform, StyleSheet, StatusBar, LogBox } from "react-native";
import colours from "./config/colours";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";
import GoalsPage from "./pages/Goal/GoalsPage";
import BudgetPage from "./pages/Budget/BudgetPage";
import ReportsPage from "./pages/ReportsPage";
import LocationSearch from "./pages/Budget/LocationSearch";
import NewGoal from "./pages/Goal/NewGoal";
import SaveToGoal from "./pages/Goal/SaveToGoal";
import EditGoal from "./pages/Goal/EditGoal";
import AllTableView from "./pages/AllTableView";
import ReportsPagePieChart from "./pages/ReportsPagePieChart";
import ChooseCustomDate from "./pages/ChooseCustomDate";
import ReportsPageTable from "./pages/ReportsPageTable";
import GoalHistory from "./pages/Goal/GoalHistory";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
export const Context = React.createContext({
  offTrackGoals: [],
  setOffTrackGoals: () => {},
});

LogBox.ignoreAllLogs();

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Signup" component={SignupPage} />
      <Stack.Screen name="HomePage" component={MyTabs} />
    </Stack.Navigator>
  );
}

function GoalsAll() {
  return (
    <Stack.Navigator
      initialRouteName="Goals"
      screenOptions={{
        headerStyle: {
          backgroundColor: colours.whiteRock,
        },
        cardStyle: { backgroundColor: colours.white },
      }}
    >
      <Stack.Screen
        name="Goals"
        component={GoalsPage}
        options={{ headerLeft: false }}
      />
      <Stack.Screen name="New Goal" component={NewGoal} />
      <Stack.Screen name="Goal History" component={GoalHistory} />
      <Stack.Screen name="Edit Goal" component={EditGoal} />
      <Stack.Screen name="Save to Goal" component={SaveToGoal} />
    </Stack.Navigator>
  );
}

function BudgetAll() {
  return (
    <Stack.Navigator
      initialRouteName="Budget"
      screenOptions={{
        headerStyle: {
          backgroundColor: colours.whiteRock,
        },
        cardStyle: { backgroundColor: colours.white },
      }}
    >
      <Stack.Screen
        name="Budget"
        component={BudgetPage}
        options={{ headerLeft: false }}
      />
      <Stack.Screen name="Location Search" component={LocationSearch} />
    </Stack.Navigator>
  );
}

function ReportsPageAll() {
  return (
    <Stack.Navigator
      initialRouteName="Report"
      screenOptions={{
        headerStyle: {
          backgroundColor: colours.whiteRock,
        },
        cardStyle: { backgroundColor: colours.white },
      }}
    >
      <Stack.Screen
        name="Report"
        component={ReportsPage}
        options={{ headerLeft: false }}
      />
      <Stack.Screen name="ReportsPage" component={ReportsPage} />
      <Stack.Screen name="Pie Chart View" component={ReportsPagePieChart} />
      <Stack.Screen name="Custom Date" component={ChooseCustomDate} />
      <Stack.Screen name="Table View" component={ReportsPageTable} />
    </Stack.Navigator>
  );
}

function HomePageAll() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: colours.whiteRock,
        },
        cardStyle: { backgroundColor: colours.white },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomePage}
        options={{ headerLeft: false }}
      />
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="All Table View" component={AllTableView} />
    </Stack.Navigator>
  );
}

const screenOptions = (route, color) => {
  let iconName;
  switch (route.name) {
    case "Home":
      iconName = "home";

      break;
    case "Goal":
      iconName = "piggy-bank-outline";
      break;

    case "Budget":
      iconName = "plus-circle";
      break;

    case "Report":
      iconName = "file-document-outline";
      break;
    case "Settings":
      iconName = "cog";
      break;
    default:
      break;
  }
  return <MaterialCommunityIcons name={iconName} color={color} size={28} />;
};

function MyTabs() {
  const [offTrackGoals, setOffTrackGoals] = React.useState([]);
  return (
    <Context.Provider value={{ offTrackGoals, setOffTrackGoals }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: colours.whiteRock,
          },
          unmountOnBlur: true,
          tabBarActiveTintColor: colours.tomato,
          tabBarStyle: {
            backgroundColor: colours.whiteRock,
            height: 60,
            paddingBottom: 2,
          },
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ color }) => screenOptions(route, color),
        })}
        sceneContainerStyle={{ backgroundColor: colours.white }}
      >
        <Tab.Screen
          name="Home"
          component={HomePageAll}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Goal"
          component={GoalsAll}
          options={{
            tabBarHideOnKeyboard: true,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Budget"
          component={BudgetAll}
          options={{
            tabBarHideOnKeyboard: true,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Report"
          component={ReportsPageAll}
          options={{
            headerShown: false,
          }}
        />

        <Tab.Screen name="Settings" component={SettingsPage} />
      </Tab.Navigator>
    </Context.Provider>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={{ colors: colours.black }}>
      <MyStack />
    </NavigationContainer>
  );
}

// export default function App() {
//   return (
//     <NavigationContainer theme={{ colors: colours.black }}>
//       <MyTabs />
//     </NavigationContainer>
//   );
// }

const styles = StyleSheet.create({
  bottomTabIcon: {
    width: 30,
    height: 30,
    overflow: "visible",
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    backgroundColor: colours.brown,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
