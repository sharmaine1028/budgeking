import { Platform, StyleSheet, StatusBar, View } from "react-native";
import colours from "./config/colours";
import LoginPage from "./pages/LoginPage";
import LoginSignupPage from "./pages/LoginSignupPage";

export default function App() {
  return (
    <View style={styles.container}>
      <LoginSignupPage />
      {/* <LoginPage /> */}
    </View>
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
