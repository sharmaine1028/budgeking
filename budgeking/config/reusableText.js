import React from "react";
import { StyleSheet, View, Text, TextInput, Dimensions } from "react-native";
import colours from "./colours";

function reusableText(props) {
  return <div></div>;
}

export function Footer({ onPress, text, desc }) {
  return (
    <View style={styles.footerView}>
      <Text style={styles.footerText}>
        {desc}{" "}
        <Text onPress={onPress} style={styles.footerLink}>
          {text}
        </Text>
      </Text>
    </View>
  );
}

export function Title({ text }) {
  return <Text style={styles.title}>{text}</Text>;
}

export function Header({ text }) {
  return <Text style={styles.header}>{text}</Text>;
}

export function BrownTextInput({
  placeholder,
  onChangeText,
  onChange,
  value,
  maxLength,
  secureTextEntry,
}) {
  return (
    <>
      <TextInput
        style={styles.brownInput}
        onChangeText={onChangeText}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        autoCapitalize="none"
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
      />
    </>
  );
}

export function WhiteTextInput({
  placeholder,
  onChangeText,
  onChange,
  value,
  maxLength,
  secureTextEntry,
}) {
  return (
    <>
      <TextInput
        style={styles.whiteInput}
        onChangeText={onChangeText}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        autoCapitalize="none"
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
      />
    </>
  );
}

const styles = StyleSheet.create({
  brownInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: colours.lightBrown,
    borderRadius: 25,
    width: 320,
    height: 46,
  },
  footerView: {
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#2e2e2d",
  },
  footerLink: {
    color: "#788eec",
    fontWeight: "bold",
    fontSize: 16,
  },
  header: {
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 15,
    paddingVertical: 10,
  },
  title: {
    fontWeight: "500",
    fontSize: 20,
    color: "#000",
    lineHeight: 20,
  },
  whiteInput: {
    backgroundColor: "#fff",
    borderWidth: 0.3,
    borderColor: "#251F47",
    borderRadius: 5,
    width: 320,
    height: 30,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0,
    shadowRadius: 1,
    elevation: 8,
  },
});
export default reusableText;
