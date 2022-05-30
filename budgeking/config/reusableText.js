import React from "react";
import { StyleSheet, View, Text } from "react-native";
<<<<<<< HEAD
import colours from "./colours";
=======
>>>>>>> c34ad90f750e0b02551c58587a2c18f65bd24b31

function reusableText(props) {
  return <div></div>;
}

export function Footer({ onPress, text, desc }) {
  return (
    <View style={styles.footerView}>
      <Text style={styles.footerText}>
        {desc}{" "}
        <Text onPress={onPress} style={styles.footerLink}>
          {text}
        </Text>
      </Text>
    </View>
  );
}

<<<<<<< HEAD
export function Title({ text, style }) {
  return (
    <View style={{ justifyContent: "space-between" }}>
      <Text style={[styles.title, style]}>{text}</Text>
    </View>
  );
}

=======
>>>>>>> c34ad90f750e0b02551c58587a2c18f65bd24b31
const styles = StyleSheet.create({
  footerView: {
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#2e2e2d",
  },
  footerLink: {
    color: "#788eec",
    fontWeight: "bold",
    fontSize: 16,
  },
<<<<<<< HEAD
  title: {
    color: colours.black,
    fontSize: 20,
  },
=======
>>>>>>> c34ad90f750e0b02551c58587a2c18f65bd24b31
});
export default reusableText;
