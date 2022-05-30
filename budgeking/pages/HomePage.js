import React from "react";
import { Text, StyleSheet, View, Button } from "react-native";
import { MyTabs } from "../config/botTab";
import colours from "../config/colours";
import { auth, firebase } from "../config/firebase";

const signOut = () => {
  auth
    .signOut()
    .then(() => {
      this.props.navigation.navigate("Login");
    })
    .catch((error) => this.setState({ errorMessage: error.message }));
};

export default class HomePage extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    this.state = {
      username: auth.currentUser.displayName,
      uid: auth.currentUser.uid,
    };
    return (
      <>
        <View style={styles.container}>
          <Text style={styles.textStyle}>Hello, {this.state.username}</Text>
          <BlackButton text={"Logout"} onPress={signOut} />
        </View>
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 35,
    backgroundColor: colours.white,
  },
  textStyle: {
    fontSize: 15,
    marginBottom: 20,
  },
});
