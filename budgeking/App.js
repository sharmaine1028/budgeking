import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Platform, StyleSheet, StatusBar, Image } from "react-native";
import colours from "./config/colours";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";
import GoalsPage from "./pages/GoalsPage";
import BudgetPage from "./pages/BudgetPage";
import ReportsPage from "./pages/ReportsPage";
import LocationSearch from "./pages/LocationSearch";
import NewGoal from "./pages/NewGoal";
import GoalHistory from "./pages/GoalHistory";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
    </Stack.Navigator>
  );
}

function BudgetAll() {
  return (
    <Stack.Navigator
      initialRouteName="Budget"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="BudgetPage" component={BudgetPage} />
      <Stack.Screen name="Location Search" component={LocationSearch} />
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
  return (
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
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen
        name="Goal"
        component={GoalsAll}
        options={{
          tabBarHideOnKeyboard: true,
          headerShown: false,
        }}
      />
      <Tab.Screen name="Budget" component={BudgetAll} />
      <Tab.Screen name="Report" component={ReportsPage} />
      <Tab.Screen name="Settings" component={SettingsPage} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={{ colors: colours.black }}>
      <MyStack />
    </NavigationContainer>
  );
}

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
