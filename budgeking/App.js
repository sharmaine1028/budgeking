import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { registerRootComponent } from "expo";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform, StyleSheet, StatusBar, Image } from "react-native";
import colours from "./config/colours";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SettingsPage from "./pages/SettingsPage";
import GoalsPage from "./pages/GoalsPage";
import BudgetPage from "./pages/BudgetPage";
import ReportsPage from "./pages/ReportsPage";
import { auth } from "./config/firebase";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// export default function App() {
//   return <LoginPage />;
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

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colours.whiteRock,
        },
        tabBarActiveTintColor: colours.tomato,
        tabBarStyle: { backgroundColor: colours.whiteRock },
      }}
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
        initialParams={{ displayName: auth.currentUser.displayName }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsPage}
        options={{
          tabBarIcon: () => (
            <Image
              style={styles.bottomTabIcon}
              source={require("./assets/icons/goals.png")}
            />
          ),
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
  // const [initializing, setInitializing] = useState(true);
  // const [user, setUser] = useState();

  // function onAuthStateChanged(user) {
  //   setUser(user);
  //   if (initializing) setInitializing(false);
  // }

  // useEffect(() => {
  //   const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
  //   return subscriber; // unsubscribe on unmount
  // }, []);

  // if (initializing) return null;

  // if (!user) {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  bottomTabIcon: {
    width: 20,
    height: 20,
    padding: 2,
  },
  container: {
    flex: 1,
    backgroundColor: colours.brown,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

registerRootComponent(App);
