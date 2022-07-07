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
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { db } from "../../config/firebase";

function GenerateGoal({ doc, time, deleteItem, saveItem, editItem }) {
  const navigation = useNavigation();
  const [isMenu, setIsMenu] = useState(false);

  const getPercent = () => {
    const percent = (doc.currSavingsAmt / doc.target) * 100;
    if (percent > 100) {
      return "100%";
    } else {
      return (doc.currSavingsAmt / doc.target) * 100 + "%";
    }
  };

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

  const showMenu = () => {
    setIsMenu(true);
  };

  const hideMenu = (id) => {
    setIsMenu(false);
  };

  const deleteGoal = () => {
    return Alert.alert(
      "Are you sure?",
      "This is irreversible. Are you sure you want to delete this goal?",
      [
        // "Yes button"
        {
          text: "Yes",
          onPress: () => {
            deleteItem(doc.id, time);
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
      <View style={[styles.goalLine, { marginTop: 5 }]}>
        <MaterialCommunityIcons
          name="clock-outline"
          size={24}
          color="black"
          style={{ flex: 0.1 }}
        />
        <Text style={{ flex: 0.3, paddingLeft: 30 }}> Deadline </Text>
        <Text style={{ flex: 0.5, paddingLeft: 30 }}>
          {dateFormat(doc.deadline.seconds)}
        </Text>
      </View>
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

export default GenerateGoal;
