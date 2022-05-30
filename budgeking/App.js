import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { registerRootComponent } from "expo";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform, StyleSheet, StatusBar, View } from "react-native";
import colours from "./config/colours";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
<<<<<<< HEAD

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: colours.lightBrown,
        },
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomePage}
        options={{ title: "Home", headerBackVisible: false, headerShown: true }}
      />
    </Stack.Navigator>
  );
}
=======
import { useState, useEffect } from "react";
import { auth } from "./config/firebase";

const Stack = createNativeStackNavigator();

// export default function App() {
//   return <LoginPage />;
// }
>>>>>>> c34ad90f750e0b02551c58587a2c18f65bd24b31

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: colours.lightBrown,
        },
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomePage}
        options={{ title: "Home", headerBackVisible: false }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
<<<<<<< HEAD
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

=======
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  // if (!user) {
>>>>>>> c34ad90f750e0b02551c58587a2c18f65bd24b31
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
  // }

  // return (
  //   <>
  //     <HomePage />
  //   </>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.brown,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

<<<<<<< HEAD
// registerRootComponent(App);
=======
registerRootComponent(App);
>>>>>>> c34ad90f750e0b02551c58587a2c18f65bd24b31
