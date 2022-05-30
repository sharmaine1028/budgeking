import React from "react";
import { BlackButton } from "../config/reusableButton";
import { auth } from "../config/firebase";
import { View, StyleSheet, StatusBar } from "react-native";
import { Title } from "../config/reusableText";
import RedLine from "../config/reusablePart";

const signOut = () => {
  auth
    .signOut()
    .then(() => {
      this.props.navigation.navigate("Login");
    })
    .catch((error) => this.setState({ errorMessage: error.message }));
};

function SettingsPage(props) {
  return (
    <View style={styles.container}>
      <Title text={"Profile"} style={styles.title} />
      <RedLine />
      <BlackButton text={"Logout"} onPress={signOut} />
    </View>
  );
}

// Update user profile
// https://firebase.google.com/docs/auth/web/manage-users

export default SettingsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: StatusBar.currentHeight,
  },
  title: {
    textAlign: "left",
  },
});
