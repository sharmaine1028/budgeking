import React from "react";
import { ScrollView, View, StyleSheet, Dimensions } from "react-native";
import { BlackButton } from "../config/reusableButton";
import { Title } from "../config/reusableText";

function GoalsPage({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.buttonContainer}>
        <BlackButton
          text={"Add new goals"}
          style={styles.button}
          onPress={() => navigation.navigate("New Goal")}
        />

        <BlackButton
          text={"Show goal history"}
          style={styles.button}
          onPress={() => navigation.navigate("Goal History")}
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
  button: { flexGrow: 0.5, height: 40 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  container: {
    margin: 10,
  },
});

export default GoalsPage;
