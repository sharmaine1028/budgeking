import React from "react";
import { StyleSheet, View, Text } from "react-native";

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
});
export default reusableText;
