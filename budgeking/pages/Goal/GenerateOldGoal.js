import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import { GreyLine } from "../../components/reusablePart";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Header } from "../../components/reusableText";
import colours from "../../styles/colours";
import { Ionicons } from "@expo/vector-icons";
import { Menu, MenuItem } from "react-native-material-menu";

function GenerateOldGoal({ doc, deleteItem }) {
  const [showMore, setShowMore] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const dateFormat = (seconds) => {
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

  const deleteGoal = (id) => {
    return Alert.alert(
      "Are you sure?",
      "This is irreversible. Are you sure you want to delete this goal?",
      [
        // "Yes button"
        {
          text: "Yes",
          onPress: () => {
            deleteItem(id);
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };

  return (
    <Menu
      visible={showMenu}
      anchor={
        <TouchableOpacity
          onLongPress={() => setShowMenu(true)}
          activeOpacity={0.7}
        >
          <View key={doc.id} style={styles.goal}>
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

            {showMore ? (
              <>
                <Text style={styles.goalTagline}>You saved ${doc.target}</Text>
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
                            width: "100%",
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
                      <Text style={styles.goalTagline}>
                        ${doc.target.toFixed(2)}
                      </Text>
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
                  <Text style={{ flex: 0.55 }}>
                    {dateFormat(doc.deadline.seconds)}
                  </Text>
                </View>

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
                          <Text style={{ fontWeight: "bold" }}>
                            {doc.createdByEmail.slice(
                              0,
                              doc.createdByEmail.indexOf("@")
                            )}
                          </Text>{" "}
                          shared the goal with{" "}
                          <Text
                            style={{
                              fontWeight: "bold",
                              paddingLeft: 30,
                              flexWrap: "wrap",
                            }}
                          >
                            {doc.sharingEmails
                              .map((email) =>
                                email.slice(0, email.indexOf("@"))
                              )
                              .join(", ")}
                          </Text>
                        </Text>
                      </View>
                    </>
                  ) : null}

                  <>
                    <GreyLine />
                    <Text style={[styles.goalLine, { fontSize: 16 }]}>
                      Notes{" "}
                    </Text>
                    <Text style={{ paddingLeft: 10 }}>
                      {doc.notes === "" ? "None" : doc.notes}
                    </Text>
                  </>
                </View>
              </>
            ) : (
              <GreyLine />
            )}
          </View>
        </TouchableOpacity>
      }
      onRequestClose={() => setShowMenu(false)}
    >
      <MenuItem onPress={() => deleteGoal(doc.id)}>Delete</MenuItem>
    </Menu>
  );
}

const styles = StyleSheet.create({
  goal: {
    backgroundColor: colours.lightBrown,
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

export default GenerateOldGoal;
