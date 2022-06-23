import React from "react";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import { BlackButton } from "../config/reusableButton";
import { Header, NewGoalInput, Title } from "../config/reusableText";
import { auth, db } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapShot,
} from "firebase/firestore";
import colours from "../config/colours";

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
    this.state = {
      shortTermGoals: [],
      longTermGoals: [],
    };
  }

  componentDidMount() {
    this.maybeShortGoals();
    this.maybeLongGoals();
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
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
        {this.state.shortTermGoals.map((doc) => (
          <View key={doc.id} style={styles.goal}>
            <Header text={doc.goalDescription} />
            <Text>
              Save {doc.freqAmount} {doc.frequency}{" "}
            </Text>
            <Text>{this.dateFormat(doc.deadline.seconds)}</Text>

            {/* {this.generateGoal(doc)} */}
          </View>
        ))}

        <Title text={"Long-term goals"} />
        {this.state.longTermGoals.map((doc) => (
          <Text key={doc.id}>{doc.goalDescription}</Text>
        ))}
      </ScrollView>
    );
  }

  // TODO: merge functionality of maybeShortGoals and maybeLongGoals
  // TODO: check if any goals change to short term
  maybeShortGoals = async () => {
    try {
      const shortTermGoals = [];

      await this.shortTermRef
        .where("createdBy", "==", auth.currentUser.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            shortTermGoals.push({ ...doc.data(), id: doc.id });
          });
        })
        .catch((err) => console.log(err));

      await this.shortTermRef
        .where("sharingEmails", "==", auth.currentUser.email)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            shortTermGoals.push({ ...doc.data() });
          });
        })
        .catch((err) => console.log(err));

      this.setState({ shortTermGoals: shortTermGoals });
    } catch {
      (err) => console.log(err);
    }
  };

  maybeLongGoals = async () => {
    try {
      const longTermGoals = [];

      await this.longTermRef
        .where("createdBy", "==", auth.currentUser.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            longTermGoals.push({ ...doc.data(), id: doc.id });
          });
        })
        .catch((err) => console.log(err));

      await this.longTermRef
        .where("sharingEmails", "==", auth.currentUser.email)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            longTermGoals.push({ ...doc.data(), id: doc.id });
          });
        })
        .catch((err) => console.log(err));

      this.setState({ longTermGoals: longTermGoals });
      console.log("test", this.state.longTermGoals);
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
}

// generateGoal = (doc) => {
//   <>
//     <Header text={doc.goalDescription} />
//   </>;
// };

const styles = StyleSheet.create({
  button: { flexGrow: 0.5, height: 40 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  goal: {
    backgroundColor: colours.lightBrown,
    borderRadius: 15,
    marginVertical: 5,
    padding: 10,
  },
  goalTitle: {
    color: "#6C757D",
    fontSize: 12,
  },
  container: {
    margin: 10,
  },
});

export default GoalsPage;
