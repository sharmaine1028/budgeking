import React from "react";
import { Divider } from "react-native-elements";
import colours from "../styles/colours";

function reusablePart(props) {
  return <div></div>;
}
export default function RedLine() {
  return (
    <Divider
      orientation="horizontal"
      color={colours.red}
      width={3}
      style={{ marginVertical: 5 }}
    />
  );
}

export function GreyLine() {
  return (
    <Divider
      orientation="horizontal"
      color={colours.grey}
      width={2}
      style={{ marginVertical: 3 }}
    />
  );
}
