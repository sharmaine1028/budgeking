import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { auth, db } from "../../config/firebase";
import { BlackButton } from "../../config/reusableButton";
import { Title } from "../../config/reusableText";
import GenerateOldGoal from "./GenerateOldGoal";

class GoalHistory extends React.Component {
  constructor() {
    super();
    this.inactiveGoalsRef = db.collection("inactive goals");
    this.inactiveGoalsOriRef = this.inactiveGoalsRef.where(
      "createdBy",
      "==",
      auth.currentUser.uid
    );
    this.inactiveGoalsSharedRef = this.inactiveGoalsRef.where(
      "sharingEmails",
      "array-contains",
      auth.currentUser.email
    );

    this.state = {
      inactiveGoals: [],
    };
  }

  componentDidMount() {
    this.unsubscribeInactiveGoalsOri = this.inactiveGoalsOriRef.onSnapshot(
      this.getGoals
    );
    this.unsubscribeInactiveGoalsShared =
      this.inactiveGoalsSharedRef.onSnapshot(this.getGoals);

    this.unsubscribeAll = this.props.navigation.addListener("focus", () => {
      this.unsubscribeInactiveGoalsOri;
      this.unsubscribeInactiveGoalsShared;
    });
  }

  componentWillUnmount() {
    this.unsubscribeInactiveGoalsOri();
    this.unsubscribeInactiveGoalsShared();
    this.unsubscribeAll();
  }

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <View>
          {this.state.inactiveGoals.length !== 0
            ? this.state.inactiveGoals.map((doc) => (
                <GenerateOldGoal
                  key={doc.id}
                  doc={doc}
                  deleteItem={this.deleteItem}
                />
              ))
            : this.renderNoGoals()}
        </View>
      </KeyboardAwareScrollView>
    );
  }

  getGoals = (querySnapshot) => {
    try {
      querySnapshot.forEach((doc) => {
        const newState = this.state.shortTermGoals.filter(
          (item) => item.id !== doc.id
        );
        this.setState({
          inactiveGoals: [...newState, { ...doc.data(), id: doc.id }],
        });
      });
    } catch {
      (err) => console.log(err);
    }
  };

  renderNoGoals = () => {
    return (
      <Text
        style={[styles.goalTagline, { alignSelf: "center", marginTop: 20 }]}
      >
        No Past Goals yet
      </Text>
    );
  };

  deleteItem = (id) => {
    const newList = this.state.inactiveGoals.filter((item) => item.id !== id);
    this.setState({ inactiveGoals: newList });
    this.inactiveGoalsRef.doc(id).delete();
  };
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    paddingBottom: 50,
  },
});

export default GoalHistory;
