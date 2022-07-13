import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import { GreyLine } from "../../config/reusablePart";
import { Menu, MenuItem } from "react-native-material-menu";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Header } from "../../config/reusableText";
import colours from "../../config/colours";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../config/firebase";
import { Ionicons } from "@expo/vector-icons";

function GenerateGoal({ doc, time, deleteItem, saveItem, editItem }) {
  const navigation = useNavigation();
  if (doc.deadline.seconds) {
    doc.deadline = new Date(doc.deadline.seconds * 1000);
  }
  const [isMenu, setIsMenu] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const sharingEmails = doc.sharingEmails.filter(
    (item) => item !== auth.currentUser.email
  );

  useEffect(() => isOffTrack(), [doc.isOffTrack]);

  const getPercent = () => {
    const percent = (doc.currSavingsAmt / doc.target) * 100;
    if (percent > 100) {
      return "100%";
    } else {
      return (doc.currSavingsAmt / doc.target) * 100 + "%";
    }
  };

  const dateFormat = () => {
    const date = doc.deadline;
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

  const showMenu = () => {
    setIsMenu(true);
  };

  const hideMenu = (id) => {
    setIsMenu(false);
  };

  const deleteGoal = () => {
    let text;
    if (doc.createdBy === auth.currentUser.uid) {
      if (doc.isSharing) {
        text = "This goal will be deleted for all members and is irreversible.";
      } else {
        text = "This is an irreversible operation.";
      }
    } else {
      text = "This goal will only be deleted for you and not sharing members";
    }

    return Alert.alert("Are you sure?", text, [
      // "Yes button"
      {
        text: "Yes",
        onPress: () => {
          deleteItem(doc.id, time, doc);
        },
      },
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: "No",
      },
    ]);
  };

  const isOffTrack = () => {
    const today = new Date();
    const deadline = doc.deadline;
    const dateCreated = new Date(doc.dateCreated.seconds * 1000);

    if (deadline < today) {
      db.collection("active goals").doc(doc.id).update({ isOffTrack: true });
      return;
    }
    // Get supposed amount based on frequency
    const years = today.getFullYear() - dateCreated.getFullYear();
    let supposedAmt;
    if (doc.frequency === "Yearly") {
      supposedAmt = doc.freqAmount * years;
    } else if (doc.frequency === "Monthly") {
      const months =
        years * 12 + today.getMonth() - dateCreated.getMonth() <= 0
          ? 0
          : years * 12 + today.getMonth() - dateCreated.getMonth();
      supposedAmt = doc.freqAmount * months;
    } else if (doc.frequency === "Weekly") {
      const msInWeek = 1000 * 60 * 60 * 24 * 7;
      const weeks = Math.round(Math.abs(today - dateCreated) / msInWeek);
      supposedAmt = doc.freqAmount * weeks;
    } else {
      const msInDay = 1000 * 3600 * 24;
      const days = Math.round(Math.abs(today - dateCreated) / msInDay);
      supposedAmt = doc.freqAmount * days;
    }

    // Compare supposed amount with curramount
    if (doc.currSavingsAmt < supposedAmt) {
      db.collection("active goals").doc(doc.id).update({ isOffTrack: true });
    } else {
      db.collection("active goals").doc(doc.id).update({ isOffTrack: false });
    }
  };

  return (
    <View key={doc.id} style={doc.isOffTrack ? styles.goalRed : styles.goal}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Header
          text={`Save for ${doc.goalDescription}`}
          style={{ fontWeight: "bold" }}
        />

        <Menu
          visible={isMenu}
          anchor={
            <TouchableOpacity onPress={() => showMenu(doc.id)}>
              <MaterialCommunityIcons
                name="more"
                size={24}
                color={colours.black}
              />
            </TouchableOpacity>
          }
          onRequestClose={() => hideMenu(doc.id)}
        >
          <MenuItem
            onPress={() =>
              navigation.navigate("Edit Goal", {
                doc: doc,
                time: time,
                editItem: editItem,
              })
            }
          >
            Edit
          </MenuItem>

          <MenuItem
            onPress={() => {
              navigation.navigate("Save to Goal", {
                doc: doc,
                time: time,
                saveItem: saveItem,
              });
            }}
          >
            Save
          </MenuItem>
          <MenuItem onPress={() => deleteGoal(doc.id)}>Delete</MenuItem>
        </Menu>
      </View>

      {doc.isOffTrack ? (
        <Text style={styles.goalTagline}>
          You're behind schedule to save ${doc.freqAmount}{" "}
          {doc.frequency.toString().toLowerCase()}
        </Text>
      ) : (
        <Text style={styles.goalTagline}>
          You're on track to save ${doc.freqAmount}{" "}
          {doc.frequency.toString().toLowerCase()}
        </Text>
      )}

      <View style={styles.goalLine}>
        <MaterialCommunityIcons
          name="bullseye-arrow"
          size={24}
          color="black"
          style={{ flex: 0.1 }}
        />
        <View style={{ paddingLeft: 30, flex: 0.85 }}>
          <View style={[styles.progressBar]}>
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: "#96D3FF",
                  width: getPercent(),
                  // width: (doc.currSavingsAmt / doc.target) * 100 + "%",
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
            <Text style={styles.goalTagline}>
              ${doc.currSavingsAmt.toFixed(2)}
            </Text>
            <Text style={styles.goalTagline}>${doc.target.toFixed(2)}</Text>
          </View>
        </View>
      </View>
      <GreyLine />
      <View style={styles.goalLine}>
        <MaterialCommunityIcons
          name="clock-outline"
          size={24}
          color="black"
          style={{ flex: 0.1 }}
        />
        <Text style={{ flex: 0.3, paddingLeft: 30 }}> Deadline </Text>
        <Text style={{ flex: 0.55 }}>{dateFormat(doc.deadline)}</Text>

        {showMore ? (
          <TouchableOpacity onPress={() => setShowMore(false)}>
            <MaterialCommunityIcons
              name="chevron-up"
              size={24}
              color={colours.darkgrey}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setShowMore(true)}>
            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color={colours.darkgrey}
            />
          </TouchableOpacity>
        )}
      </View>

      {showMore && (
        <View>
          {doc.isSharing ? (
            <>
              <GreyLine />
              <View style={styles.goalLine}>
                <Ionicons
                  name="md-share-outline"
                  size={24}
                  color="black"
                  style={{ flex: 0.1 }}
                />
                <Text style={{ flex: 0.8, paddingLeft: 30 }}>
                  Goal shared with{" "}
                  <Text
                    style={{
                      fontWeight: "bold",
                      paddingLeft: 30,
                      flexWrap: "wrap",
                    }}
                  >
                    {sharingEmails
                      .map((email) => email.slice(0, email.indexOf("@")))
                      .join(", ")}
                  </Text>
                </Text>
              </View>
            </>
          ) : null}

          <>
            <GreyLine />
            <Text style={[styles.goalLine, { fontSize: 16 }]}>Notes </Text>
            <Text style={{ paddingLeft: 10 }}>
              {doc.notes === "" ? "None" : doc.notes}
            </Text>
          </>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  goal: {
    backgroundColor: colours.lightBrown,
    borderRadius: 15,
    marginVertical: 5,
    padding: 10,
  },
  goalRed: {
    backgroundColor: colours.tomato,
    borderRadius: 15,
    marginVertical: 5,
    padding: 10,
  },
  goalLine: {
    flexDirection: "row",
    paddingLeft: 10,
    marginVertical: 5,
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

export default GenerateGoal;
