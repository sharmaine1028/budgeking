import React from "react";
import { BlackButton } from "../config/reusableButton";
import { auth } from "../config/firebase";
import { Header, Title, WhiteTextInput } from "../config/reusableText";
import RedLine from "../config/reusablePart";
import { StyleSheet, View } from "react-native";
import { updateProfile, updatePassword } from "firebase/auth";

class SettingsPage extends React.Component {
  constructor() {
    super();
    this.state = {
      displayName: auth.currentUser.displayName,
      password: "",
    };
  }

  updateInputVal(val, prop) {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  updateUserDisplayName = (props) => {
    updateProfile(auth.currentUser, {
      displayName: `${this.state.displayName}`,
    })
      .then((res) => {
        alert("Profile updated!");
        this.props.home;
        console.log(auth.currentUser.displayname);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  updateUserPassword = (props) => {
    updatePassword(auth.currentUser, `${this.state.password}`)
      .then((res) => {
        alert("Password updated!");
      })
      .catch((error) => alert(error.message));
  };

  signOut = () => {
    auth
      .signOut()
      .then(() => {
        this.props.navigation.navigate("Login");
      })
      .catch((error) => alert(error.message));
  };

  render() {
    return (
      <View style={styles.container}>
        <Title text={"Profile"} />
        <RedLine />
        <Header text={"Change profile picture"} />

        <Header text={"Change username"} />
        <WhiteTextInput
          placeholder={this.state.displayName}
          value={this.state.displayName}
          onChangeText={(val) => {
            this.updateInputVal(val, "displayName");
            console.log(this.state.displayName);
          }}
        />
        <BlackButton
          text={"Change"}
          style={styles.smallButton}
          textStyle={styles.buttonTextStyle}
          onPress={(val) => this.updateUserDisplayName(val)}
        />

        <Header text={"Change password"} />
        <WhiteTextInput
          placeholder={"At least 6 characters"}
          value={this.state.password}
          onChangeText={(val) => this.updateInputVal(val, "password")}
        />
        <BlackButton
          text={"Change"}
          style={styles.smallButton}
          textStyle={styles.buttonTextStyle}
          onPress={(val) => this.updateUserPassword(val)}
        />

        <Title text={"Avatar"} />
        <RedLine />

        <BlackButton
          text={"Log out"}
          onPress={() => this.signOut()}
          style={styles.logout}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  smallButton: {
    width: 130,
    height: 40,
    alignSelf: "flex-end",
  },
  buttonTextStyle: {
    fontSize: 13,
  },
  logout: {
    width: 180,
  },
});

// Update user profile
// https://firebase.google.com/docs/auth/web/manage-users

export default SettingsPage;
