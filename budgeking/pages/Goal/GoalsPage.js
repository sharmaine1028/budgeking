import React from "react";
import { View, StyleSheet, Text, LogBox } from "react-native";
import { BlackButton } from "../../config/reusableButton";
import { Title } from "../../config/reusableText";
import { auth, db } from "../../config/firebase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import GenerateGoal from "./GenerateGoal";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

class GoalsPage extends React.Component {
  constructor() {
    super();
    this.activeGoalsRef = db.collection("active goals");
    this.activeGoalsOri = this.activeGoalsRef.where(
      "createdBy",
      "==",
      auth.currentUser.uid
    );
    this.activeGoalsShared = this.activeGoalsRef.where(
      "sharingEmails",
      "array-contains",
      auth.currentUser.email
    );

    // this.unsubscribeShortTermOri = this.shortTermOri.onSnapshot(
    //   (querySnapshot) => this.getGoals(querySnapshot, "short")
    // );
    // this.unsubscribeShortTermShared = this.shortTermShared.onSnapshot(
    //   (querySnapshot) => this.getGoals(querySnapshot, "short")
    // );
    // this.unsubscribeLongTermOri = this.longTermOri.onSnapshot((querySnapshot) =>
    //   this.getGoals(querySnapshot, "long")
    // );
    // this.unsubscribeLongTermShared = this.longTermShared.onSnapshot(
    //   (querySnapshot) => this.getGoals(querySnapshot, "long")
    // );

    this.state = {
      shortTermGoals: [],
      longTermGoals: [],
    };
  }

  componentDidMount() {
    this.unsubscribeActiveGoalsOri = this.activeGoalsOri.onSnapshot(
      this.getGoals
    );
    this.unsubscribeActiveGoalsShared = this.activeGoalsShared.onSnapshot(
      this.getGoals
    );

    this.unsubscribeSavings = this.props.navigation.addListener("focus", () => {
      this.unsubscribeActiveGoalsOri;
      this.unsubscribeActiveGoalsShared;
      // this.setState({
      //   shortTermGoals: this.state.shortTermGoals,
      //   longTermGoals: this.state.longTermGoals,
      // });
    });
  }

  componentWillUnmount() {
    this.unsubscribeActiveGoalsOri();
    this.unsubscribeActiveGoalsShared();
    this.unsubscribeSavings();
  }

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <View style={styles.buttonContainer}>
          <BlackButton
            text={"Add new goals"}
            style={styles.button}
            onPress={() => this.props.navigation.navigate("New Goal")}
          />

          {/* <BlackButton
            text={"Show goal history"}
            style={styles.button}
            onPress={() => this.props.navigation.navigate("Goal History")}
          /> */}
        </View>
        <Title text={"Short-term goals"} />
        {this.state.shortTermGoals.length !== 0
          ? this.state.shortTermGoals.map((doc) => (
              <GenerateGoal
                key={doc.id}
                doc={doc}
                time={"short term"}
                deleteItem={this.deleteGoal}
                saveItem={this.saveToGoal}
                editItem={this.editGoal}
              />
            ))
          : this.renderNoGoals()}

        <Title text={"Long-term goals"} />
        {this.state.longTermGoals.length !== 0
          ? this.state.longTermGoals.map((doc) => (
              <GenerateGoal
                key={doc.id}
                doc={doc}
                time={"long term"}
                deleteItem={this.deleteGoal}
                saveItem={this.saveToGoal}
                editItem={this.editGoal}
              />
            ))
          : this.renderNoGoals()}
      </KeyboardAwareScrollView>
    );
  }

  getGoals = (querySnapshot) => {
    try {
      querySnapshot.forEach((doc) => {
        const deadlineYear = new Date(
          doc.data().deadline.seconds * 1000
        ).getFullYear();
        const todayYear = new Date().getFullYear();

        if (deadlineYear - todayYear < 5) {
          const newState = this.state.shortTermGoals.filter(
            (item) => item.id !== doc.id
          );

          this.setState({
            shortTermGoals: [...newState, { ...doc.data(), id: doc.id }],
          });
        } else {
          const newState = this.state.longTermGoals.filter(
            (item) => item.id !== doc.id
          );
          this.setState({
            longTermGoals: [...newState, { ...doc.data(), id: doc.id }],
          });
        }
        // newState.push({ ...doc.data(), id: doc.id });
      });
    } catch {
      (err) => console.log(err);
    }
  };

  /*
  getGoals = (querySnapshot, timePeriod) => {
    try {
      if (timePeriod === "short") {
        let newState = this.state.shortTermGoals;
        querySnapshot.forEach((doc) => {
          newState = newState.filter((item) => item.id !== doc.id);
          newState.push({ ...doc.data(), id: doc.id });
        });
        this.setState({
          shortTermGoals: newState,
        });
      }

      if (timePeriod === "long") {
        let newState = this.state.longTermGoals;
        querySnapshot.forEach((doc) => {
          newState = newState.filter((item) => item.id !== doc.id);
          newState.push({ ...doc.data(), id: doc.id });
        });
        this.setState({
          longTermGoals: newState,
        });
      }
    } catch {
      (err) => console.log(err);
    }
  };
  */

  editGoal = (id, time, data) => {
    if (time === "short term") {
      const newList = this.state.shortTermGoals.filter(
        (item) => item.id !== id
      );
      this.setState({ shortTermGoals: newList });
    } else {
      const newList = this.state.longTermGoals.filter((item) => item.id !== id);
      this.setState({ longTermGoals: newList });
    }
    this.activeGoalsRef.doc(id).set({
      createdBy: data.createdBy,
      goalDescription: data.goalDescription,
      target: data.target,
      frequency: data.frequency,
      freqAmount: data.freqAmount,
      deadline: data.deadline,
      notes: data.notes,
      isSharing: data.isSharing,
      sharingEmails: data.sharingEmails,
      sharingUIDs: data.sharingUIDs,
      currSavingsAmt: data.currSavingsAmt,
    });
  };

  saveToGoal = (id, time, newAmt) => {
    if (time === "short term") {
      const newList = this.state.shortTermGoals.filter(
        (item) => item.id !== id
      );
      this.setState({ shortTermGoals: newList });
    } else {
      const newList = this.state.longTermGoals.filter((item) => item.id !== id);
      this.setState({ longTermGoals: newList });
    }
    this.activeGoalsRef.doc(id).update({ currSavingsAmt: newAmt });
  };

  deleteGoal = (id, time) => {
    if (time === "short term") {
      const newList = this.state.shortTermGoals.filter(
        (item) => item.id !== id
      );
      this.setState({ shortTermGoals: newList });
    } else {
      const newList = this.state.longTermGoals.filter((item) => item.id !== id);
      this.setState({ longTermGoals: newList });
    }
    this.activeGoalsRef.doc(id).delete();
  };

  renderNoGoals = () => {
    return (
      <Text
        style={[styles.goalTagline, { alignSelf: "center", marginTop: 20 }]}
      >
        No Goals yet
      </Text>
    );
  };
}

const styles = StyleSheet.create({
  button: { flexGrow: 0.5, height: 40 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  container: {
    margin: 10,
    paddingBottom: 50,
  },
});

export default GoalsPage;
