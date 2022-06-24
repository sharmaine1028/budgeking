import React from "react";
import { ScrollView, View, StyleSheet, Text, Animated } from "react-native";
import { BlackButton } from "../config/reusableButton";
import { Header, Title } from "../config/reusableText";
import { auth, db } from "../config/firebase";
import colours from "../config/colours";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { GreyLine } from "../config/reusablePart";

class GoalsPage extends React.Component {
  constructor() {
    super();
    this.shortTermOri = db
      .collection("goals")
      .doc("short term")
      .collection("active")
      .where("createdBy", "==", auth.currentUser.uid);
    // .orderBy("deadline");
    this.shorttermShared = db
      .collection("goals")
      .doc("short term")
      .collection("active")
      .where("sharingEmails", "array-contains", auth.currentUser.email);
    this.longTermOri = db
      .collection("goals")
      .doc("long term")
      .collection("active")
      .where("createdBy", "==", auth.currentUser.uid);
    this.longTermShared = db
      .collection("goals")
      .doc("long term")
      .collection("active")
      .where("sharingEmails", "array-contains", auth.currentUser.email);
    this.state = {
      shortTermGoals: [],
      longTermGoals: [],
    };
  }

  componentDidMount() {
    this.unsubscribeShortTermOri = this.shortTermOri.onSnapshot(
      (querySnapshot) => this.getGoals(querySnapshot, "short")
    );
    this.unsubscribeShortTermShared = this.shorttermShared.onSnapshot(
      (querySnapshot) => this.getGoals(querySnapshot, "short")
    );
    this.unsubscribeLongTermOri = this.longTermOri.onSnapshot((querySnapshot) =>
      this.getGoals(querySnapshot, "long")
    );
    this.unsubscribeLongTermShared = this.longTermShared.onSnapshot(
      (querySnapshot) => this.getGoals(querySnapshot, "long")
    );
  }

  componentWillUnmount() {
    this.unsubscribeShortTermOri();
    this.unsubscribeShortTermShared();
    this.unsubscribeLongTermOri();
    this.unsubscribeLongTermShared();
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
        {this.state.shortTermGoals.map((doc) => this.generateGoals(doc))}

        <Title text={"Long-term goals"} />
        {this.state.longTermGoals.map((doc) => this.generateGoals(doc))}
      </KeyboardAwareScrollView>
    );
  }

  getGoals = (querySnapshot, timePeriod) => {
    try {
      const activeGoals = [];

      querySnapshot.forEach((doc) => {
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

  dateFormat = (seconds) => {
    const date = new Date(seconds * 1000);
    const [day, month, year] = [
      date.getDate(),
      date.getMonth(),
      date.getFullYear(),
    ];

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return day.toString() + " " + months[month] + " " + year.toString();
  };

  generateGoals = (doc) => {
    return (
      <View key={doc.id} style={styles.goal}>
        <Header
          text={`Save for ${doc.goalDescription}`}
          style={{ fontWeight: "bold" }}
        />
        <Text style={styles.goalTagline}>
          Save ${doc.freqAmount} {doc.frequency}
        </Text>
        <View style={styles.goalLine}>
          <MaterialCommunityIcons
            name="bullseye-arrow"
            size={24}
            color="black"
            style={{ flex: 0.1 }}
          />
          <View style={{ paddingLeft: 30, flex: 0.8 }}>
            <View style={[styles.progressBar]}>
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: "#96D3FF",
                    width: doc.currSavingsAmt / doc.target + "%",
                    borderRadius: 5,
                  },
                ]}
              ></Animated.View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.goalTagline}>${doc.currSavingsAmt}</Text>
              <Text style={styles.goalTagline}>${doc.target}</Text>
            </View>
          </View>
        </View>
        <GreyLine />
        <View style={[styles.goalLine, { marginTop: 5 }]}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={24}
            color="black"
            style={{ flex: 0.1 }}
          />
          <Text style={{ flex: 0.3, paddingLeft: 30 }}> Deadline </Text>
          <Text style={{ flex: 0.5, paddingLeft: 30 }}>
            {this.dateFormat(doc.deadline.seconds)}
          </Text>
        </View>

        {/* {this.generateGoal(doc)} */}
      </View>
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
  goal: {
    backgroundColor: colours.lightBrown,
    borderRadius: 15,
    marginVertical: 5,
    padding: 10,
  },
  goalLine: {
    flexDirection: "row",
    justifyContent: "center",
  },
  goalTagline: {
    color: colours.darkgrey,
    fontSize: 12,
    marginBottom: 10,
  },
  goalTitle: {
    color: "#6C757D",
    fontSize: 12,
  },
  progressBar: {
    flex: 1,
    height: 10,
    flexDirection: "row",
    backgroundColor: "#3F4243",
    borderColor: "#3F4243",
    borderRadius: 5,
  },
});

export default GoalsPage;
