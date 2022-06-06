import React from "react";
import { BlackButton } from "../config/reusableButton";
import { NewGoalInput, YesOrNo } from "../config/reusableText";
import { View, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

function NewGoal({ navigation }) {
  return (
    <KeyboardAwareScrollView contentContainerStyle={{ margin: 5 }}>
      {/* <Title text={"New Goal"} /> */}
      <NewGoalInput title={"Goal Description"} />
      <NewGoalInput title={"Target Amount to Save"} />
      <NewGoalInput title={"Frequency"} />
      <NewGoalInput title={"Deadline"} />
      <NewGoalInput title={"Notes"} />
      <YesOrNo title={"Would you like to share the goal with someone else?"} />
      <View style={styles.beside}>
        <BlackButton text={"Add"} style={styles.buttons} />
        <BlackButton
          text={"Cancel"}
          style={styles.buttons}
          onPress={() => navigation.navigate("Goals")}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  beside: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  buttons: {
    flexGrow: 1,
    height: 40,
  },
});
export default NewGoal;
