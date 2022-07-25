import React from "react";
import {
  View,
  StyleSheet,
  Text,
  LogBox,
  Modal,
  TouchableOpacity,
} from "react-native";
import { BlackButton } from "../../components/reusableButton";
import { Title } from "../../components/reusableText";
import { auth, db } from "../../config/firebase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import GenerateGoal from "./GenerateGoal";
import { Image } from "react-native";
import colours from "../../styles/colours";

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

    this.state = {
      shortTermGoals: [],
      longTermGoals: [],
      showModal: false,
    };
  }

  async componentDidMount() {
    this.unsubscribeActiveGoalsOri = this.activeGoalsOri.onSnapshot(
      this.getGoalsOri
    );
    this.unsubscribeActiveGoalsShared = this.activeGoalsShared.onSnapshot(
      this.getGoalsShared
    );

    this.unsubscribeSavings = this.props.navigation.addListener(
      "focus",
      async () => {
        this.unsubscribeActiveGoalsOri;
        this.unsubscribeActiveGoalsShared;
      }
    );
  }

  componentWillUnmount() {
    this.unsubscribeActiveGoalsOri();
    this.unsubscribeActiveGoalsShared();
    this.unsubscribeSavings();
  }

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        {this.state.showModal && (
          <View style={styles.modalView}>
            <Modal
              transparent={true}
              visible={this.state.showModal}
              onRequestClose={() => this.setState({ showModal: false })}
            >
              <View style={styles.modalView}>
                <View style={styles.modal}>
                  <Image
                    source={require("../../assets/congrats.gif")}
                    style={styles.modalImage}
                  />
                  <Text style={{ fontSize: 16, marginBottom: 10 }}>
                    Goal completed
                  </Text>
                  <Text style={{ marginBottom: 20 }}>
                    {" "}
                    Congrats on completing your goal!
                  </Text>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => this.setState({ showModal: false })}
                  >
                    <Text>High Five!</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )}

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
                saveItem={this.saveToGoal}
                editItem={this.editGoal}
              />
            ))
          : renderNoGoals()}

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
          : renderNoGoals()}
      </KeyboardAwareScrollView>
    );
  }

  /*
  Getting goals from database and categorising to short and long term goal
  */
  getGoalsOri = (querySnapshot) => {
    try {
      const shortTermState = [];
      const longTermState = [];
      querySnapshot.forEach((doc) => {
        const deadlineYear = new Date(
          doc.data().deadline.seconds * 1000
        ).getFullYear();
        const todayYear = new Date().getFullYear();

        if (deadlineYear - todayYear < 5) {
          shortTermState.push({ ...doc.data(), id: doc.id });
        } else {
          longTermState.push({ ...doc.data(), id: doc.id });
        }
      });

      this.setState({
        shortTermGoals: [...shortTermState],
        longTermGoals: [...longTermState],
      });
    } catch {
      (err) => console.log(err);
    }
  };

  getGoalsShared = (querySnapshot) => {
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
      });
    } catch {
      (err) => console.log(err);
    }
  };

  moveToInactive = async (id, data) => {
    await db.collection("inactive goals").doc(id).set({
      createdBy: data.createdBy,
      createdByEmail: data.createdByEmail,
      dateCreated: data.dateCreated,
      goalDescription: data.goalDescription,
      target: data.target,
      frequency: data.frequency,
      freqAmount: data.freqAmount,
      deadline: data.deadline,
      notes: data.notes,
      isSharing: data.isSharing,
      sharingEmails: data.sharingEmails,
      currSavingsAmt: data.target,
    });

    await db.collection("active goals").doc(id).delete();
  };

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

    if (data.target <= data.currSavingsAmt) {
      this.setState({ showModal: true });
      this.moveToInactive(id, data);
      return;
    }

    this.activeGoalsRef.doc(id).set({
      createdBy: data.createdBy,
      createdByEmail: data.createdByEmail,
      dateCreated: data.dateCreated,
      goalDescription: data.goalDescription,
      target: data.target,
      frequency: data.frequency,
      freqAmount: data.freqAmount,
      deadline: data.deadline,
      notes: data.notes,
      isSharing: data.isSharing,
      sharingEmails: data.sharingEmails,
      currSavingsAmt: data.currSavingsAmt,
    });
  };

  saveToGoal = (id, time, newAmt, data) => {
    if (time === "short term") {
      const newList = this.state.shortTermGoals.filter(
        (item) => item.id !== id
      );
      this.setState({ shortTermGoals: newList });
    } else {
      const newList = this.state.longTermGoals.filter((item) => item.id !== id);
      this.setState({ longTermGoals: newList });
    }

    if (newAmt >= data.target) {
      this.setState({ showModal: true });
      this.moveToInactive(id, data);
    } else {
      this.activeGoalsRef.doc(id).update({ currSavingsAmt: newAmt });
    }
  };

  deleteGoal = (id, time, data) => {
    if (time === "short term") {
      const newList = this.state.shortTermGoals.filter(
        (item) => item.id !== id
      );
      this.setState({ shortTermGoals: newList });
    } else {
      const newList = this.state.longTermGoals.filter((item) => item.id !== id);
      this.setState({ longTermGoals: newList });
    }

    if (data.createdBy === auth.currentUser.uid) {
      this.activeGoalsRef.doc(id).delete();
    } else {
      if (data.sharingEmails.length === 1) {
        data.isSharing = false;
        data.sharingEmails = [];
        this.editGoal(id, time, data);
      } else {
        data.sharingEmails = data.sharingEmails.filter(
          (item) => item !== auth.currentUser.email
        );
        this.editGoal(id, time, data);
      }
    }
  };
}

export const renderNoGoals = () => {
  return (
    <Text style={[styles.goalTagline, { alignSelf: "center", marginTop: 20 }]}>
      No Goals yet
    </Text>
  );
};
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
  modal: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#000",
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    backgroundColor: colours.lightBrown,
    borderWidth: 1,
    borderColor: "#000",
  },
  modalImage: {
    width: 70,
    height: 90,
    overflow: "visible",
    resizeMode: "contain",
  },
  modalView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default GoalsPage;
