import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform, StyleSheet, StatusBar, View } from "react-native";
import colours from "./config/colours";
import LoginPage from "./pages/LoginPage";
import LoginSignupPage from "./pages/LoginSignupPage";

const Stack = createNativeStackNavigator();

// export default function App() {
//   return <LoginPage />;
// }

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LoginSignupPage"
          component={LoginSignupPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login Page" component={LoginPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
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
