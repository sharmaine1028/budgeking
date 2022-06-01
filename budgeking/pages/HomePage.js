import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import colours from "../config/colours";
import { auth } from "../config/firebase";
import RedLine from "../config/reusablePart";
import { Header, Title } from "../config/reusableText";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

function HomePage() {
  const [displayName, setDisplayName] = useState(auth.currentUser.displayName);

  // TODO: Scroll down to refresh
  // setDisplayName{auth.currentUser.displayName}
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setDisplayName(auth.currentUser.displayName);
    wait(500).then(() => setRefreshing(false));
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Title text={`Welcome, ${displayName}`}></Title>
        <Header text={`${"\n"}Your weekly budget`} />
        <RedLine />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    paddingTop: 15,
    paddingHorizontal: 30,
    backgroundColor: colours.white,
  },
});

export default HomePage;
