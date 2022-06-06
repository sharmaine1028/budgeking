import React from "react";
import { View, StyleSheet } from "react-native";
import { BlackButton } from "../config/reusableButton";
import { Title } from "../config/reusableText";

function GoalHistory(props) {
  return (
    <View>
      <View style={styles.buttonContainer}>
        <BlackButton text={"Short-term goals"} style={styles.button} />
        <BlackButton text={"Long-term goals"} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexGrow: 1,
    height: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 10,
    flexGrow: 1,
  },
});

export default GoalHistory;
