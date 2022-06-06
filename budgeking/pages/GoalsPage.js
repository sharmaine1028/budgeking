import React from "react";
import { ScrollView, View, StyleSheet, Dimensions } from "react-native";
import { BlackButton } from "../config/reusableButton";
import { Title } from "../config/reusableText";

function GoalsPage({ navigation }) {
  return (
    <ScrollView>
      <View style={styles.buttonContainer}>
        <BlackButton
          text={"Add new goals"}
          style={styles.button}
          onPress={() => navigation.navigate("NewGoal")}
        />
        <BlackButton
          text={"Show goal history"}
          style={styles.button}
          onPress={() => navigation.navigate("GoalHistory")}
        />
      </View>
      <Title text={"Short-term goals"} />
      {/* {maybeShortGoals()} */}
      <Title text={"Long-term goals"} />
      {/* {maybeLongGoals()} */}
    </ScrollView>
  );

  const maybeShortGoals = () => {};

  const maybeLongGoals = () => {};
}

const styles = StyleSheet.create({
  button: {
    width: Dimensions.get("window").width * 0.4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default GoalsPage;
