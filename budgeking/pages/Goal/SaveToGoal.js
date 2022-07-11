import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, LogBox } from "react-native";
import { NewGoalInput, Title } from "../../config/reusableText";
import { BlackButton } from "../../config/reusableButton";
import CurrencyInput from "react-native-currency-input";
import colours from "../../config/colours";
import { db } from "../../config/firebase";

// Replace object
function SaveToGoal({ route, navigation }) {
  const { doc, time, saveItem } = route.params;
  const [savingsAmt, setSavingsAmt] = useState("0");
  const [currSavingsAmt, setCurrSavingsAmt] = useState(doc.currSavingsAmt);

  const dataRef = db.collection("active goals").doc(doc.id);

  useEffect(() => {
    const unsubscribe = dataRef.onSnapshot((doc) => {
      if (doc.exists) {
        setCurrSavingsAmt(doc.data().currSavingsAmt.toFixed(2));
      }
    });
    return unsubscribe;
  }, [currSavingsAmt, setCurrSavingsAmt]);

  const updateSavings = async (val) => {
    if (Number(val) === 0) {
      alert("Please enter a value");
      return;
    }
    const newAmt = Number(currSavingsAmt) + Number(val);

    const data = await dataRef
      .get()
      .then((doc) => doc.data())
      .catch((err) => console.log(err));
    navigation.navigate("Goals");
    saveItem(doc.id, time, newAmt, data);
  };

  return (
    <View style={styles.container}>
      <Title
        text={"Save for " + doc.goalDescription}
        style={{ marginBottom: 5 }}
      />
      <NewGoalInput
        title={"Target"}
        value={"$" + String(doc.target)}
        editable={false}
      />
      <NewGoalInput
        title={"Current Savings"}
        value={"$" + String(currSavingsAmt)}
        editable={false}
      />
      <View style={styles.newGoalInput}>
        <Text style={styles.newGoalTitle}>Add to Savings</Text>
        <CurrencyInput
          keyboardType="numeric"
          value={savingsAmt}
          prefix="$"
          unit="$"
          delimiter=","
          separator="."
          precision={2}
          minValue={0}
          maxValue={doc.target - doc.currSavingsAmt}
          onChangeValue={(val) => setSavingsAmt(val)}
          placeholder="Type Here"
        />
      </View>
      <View style={styles.buttonContainer}>
        <BlackButton
          text={"Add"}
          style={styles.button}
          onPress={() => updateSavings(savingsAmt)}
        />

        <BlackButton
          text={"Cancel"}
          style={styles.button}
          onPress={() => navigation.navigate("Goals")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: { flexGrow: 0.5, height: 40, marginTop: 10 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  container: {
    margin: 10,
    paddingBottom: 50,
  },
  newGoalInput: {
    backgroundColor: colours.lightBrown,
    borderRadius: 15,
    margin: 5,
    padding: 10,
  },
  newGoalTitle: {
    color: "#6C757D",
    fontSize: 12,
  },
});

export default SaveToGoal;
