import React from "react";
import { db } from "./config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Text, View, StyleSheet } from "react-native";

const collectionRef = collection(db, "users");

const getData = () => {
  getDocs(collectionRef)
    .then((res) => {
      console.log(res.docs.map((item) => item.data()));
    })
    .catch(console.log);
};

function FirebasePrac(props) {
  return (
    <View style={styles.container}>
      <Text>hi</Text>
      <Text>{getData()}</Text>
    </View>
  );
}

export default FirebasePrac;

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
});
