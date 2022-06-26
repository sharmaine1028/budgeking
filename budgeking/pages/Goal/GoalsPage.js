import React from "react";
import { View, StyleSheet, Text, Animated, Modal } from "react-native";
import { BlackButton } from "../../config/reusableButton";
import { Header, Title } from "../../config/reusableText";
import { auth, db } from "../../config/firebase";
import colours from "../../config/colours";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import GenerateGoal from "./GenerateGoal";

class GoalsPage extends React.Component {
  constructor() {
    super();
    this.shortTermRef = db
      .collection("goals")
      .doc("short term")
      .collection("active");
    this.longTermRef = db
      .collection("goals")
      .doc("long term")
      .collection("active");
    this.shortTermOri = this.shortTermRef.where(
      "createdBy",
      "==",
      auth.currentUser.uid
    );
    this.shortTermShared = this.shortTermRef.where(
      "sharingEmails",
      "array-contains",
      auth.currentUser.email
    );
    this.longTermOri = this.longTermRef.where(
      "createdBy",
      "==",
      auth.currentUser.uid
    );
    this.longTermShared = this.longTermRef.where(
      "sharingEmails",
      "array-contains",
      auth.currentUser.email
    );
    this.unsubscribeShortTermOri = this.shortTermOri.onSnapshot(
      (querySnapshot) => this.getGoals(querySnapshot, "short")
    );
    this.unsubscribeShortTermShared = this.shortTermShared.onSnapshot(
      (querySnapshot) => this.getGoals(querySnapshot, "short")
    );
    this.unsubscribeLongTermOri = this.longTermOri.onSnapshot((querySnapshot) =>
      this.getGoals(querySnapshot, "long")
    );
    this.unsubscribeLongTermShared = this.longTermShared.onSnapshot(
      (querySnapshot) => this.getGoals(querySnapshot, "long")
    );
    this.state = {
      shortTermGoals: [],
      longTermGoals: [],
    };
  }

  componentDidMount() {
    this.unsubscribeSavings = this.props.navigation.addListener("focus", () => {
      this.unsubscribeShortTermOri();
      this.unsubscribeShortTermShared();
      this.unsubscribeLongTermOri();
      this.unsubscribeLongTermShared();
      this.setState({ shortTermGoals: [], longTermGoals: [] });
      this.unsubscribeShortTermOri;
      this.unsubscribeShortTermShared;
      this.unsubscribeLongTermOri;
      this.unsubscribeLongTermShared;

      this.setState({
        shortTermGoals: this.state.shortTermGoals,
        longTermGoals: this.state.longTermGoals,
      });

      console.log(this.state.shortTermGoals);
    });
  }

  componentWillUnmount() {
    this.unsubscribeShortTermOri();
    this.unsubscribeShortTermShared();
    this.unsubscribeLongTermOri();
    this.unsubscribeLongTermShared();
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

          <BlackButton
            text={"Show goal history"}
            style={styles.button}
            onPress={() => this.props.navigation.navigate("Goal History")}
          />
        </View>
        <Title text={"Short-term goals"} />
        {this.state.shortTermGoals.length !== 0
          ? this.state.shortTermGoals.map((doc) => (
              <GenerateGoal
                key={doc.id}
                doc={doc}
                time={"short term"}
                deleteItem={this.deleteGoal}
              />
            ))
          : this.renderNoGoals()}

        <Title text={"Long-term goals"} />
        {this.state.longTermGoals.length !== 0
          ? this.state.longTermGoals.map((doc) => (
              <GenerateGoal key={doc.id} doc={doc} time={"long term"} />
            ))
          : this.renderNoGoals()}
      </KeyboardAwareScrollView>
    );
  }

  getGoals = async (querySnapshot, timePeriod) => {
    try {
      const activeGoals = [];

      await querySnapshot.forEach((doc) => {
        activeGoals.push({ ...doc.data(), id: doc.id });
      });

      if (timePeriod === "short") {
        this.setState({
          shortTermGoals: [...this.state.shortTermGoals, ...activeGoals],
        });
      }

      if (timePeriod === "long") {
        this.setState({
          longTermGoals: [...this.state.longTermGoals, ...activeGoals],
        });
      }
    } catch {
      (err) => console.log(err);
    }
  };

  deleteGoal = (id, time) => {
    if (time === "short term") {
      const newList = this.state.shortTermGoals.filter(
        (item) => item.id !== id
      );
      this.setState({ shortTermGoals: newList });
      this.shortTermRef.doc(id).delete();
    } else {
      const newList = this.state.longTermGoals.filter((item) => item.id !== id);
      this.setState({ longTermGoals: newList });
      this.longTermRef.doc(id).delete();
    }
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
