import React from "react";
import { Divider } from "react-native-elements";
import colours from "./colours";

function reusablePart(props) {
  return <div></div>;
}
export default function RedLine() {
  return (
    <Divider
      orientation="horizontal"
      color={colours.red}
      width={3}
      style={{ padding: 1 }}
    />
  );
}
