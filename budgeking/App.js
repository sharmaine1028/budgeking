import { NavigationContainer } from "@react-navigation/native";
import { registerRootComponent } from "expo";
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
import NewGoal from "./pages/NewGoal";
import GoalHistory from "./pages/GoalHistory";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// export default function App() {
//   return <GoalsPage />;
// }

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

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
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
      }}
      sceneContainerStyle={{ backgroundColor: colours.white }}
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          tabBarIcon: () => (
            <Image
              style={styles.bottomTabIcon}
              source={require("./assets/icons/home.png")}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsAll}
        options={{
          tabBarIcon: () => (
            <Image
              style={styles.bottomTabIcon}
              source={require("./assets/icons/goals.png")}
            />
          ),
          tabBarHideOnKeyboard: true,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Budget"
        component={BudgetPage}
        options={{
          tabBarIcon: () => (
            <Image
              style={styles.bottomTabIcon}
              source={require("./assets/icons/add.png")}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Report"
        component={ReportsPage}
        options={{
          tabBarIcon: () => (
            <Image
              style={styles.bottomTabIcon}
              source={require("./assets/icons/report.png")}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsPage}
        options={{
          tabBarIcon: () => (
            <Image
              style={styles.bottomTabIcon}
              source={require("./assets/icons/settings.png")}
            />
          ),
        }}
      />
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
