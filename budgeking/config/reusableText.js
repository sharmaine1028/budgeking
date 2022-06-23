import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import colours from "./colours";
import RadioButtonRN from "radio-buttons-react-native";

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

export function Title({ text, style }) {
  return <Text style={[styles.title, style]}>{text}</Text>;
}

export function Header({ text, style }) {
  return <Text style={[styles.header, style]}>{text}</Text>;
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

export function ImageTextInput({
  value,
  onPress,
  source,
  placeholder,
  editable,
  onChangeText,
}) {
  return (
    <View
      style={[
        styles.whiteInput,
        { flexDirection: "row", justifyContent: "space-between" },
      ]}
    >
      <TextInput
        placeholder={placeholder}
        style={{ flex: 1 }}
        value={value}
        editable={editable}
        onChangeText={onChangeText}
      />
      <TouchableOpacity onPress={onPress} style={{ justifyContent: "center" }}>
        <Image
          source={source}
          style={{
            width: 20,
            height: 20,
            alignSelf: "center",
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

export function SmallTextInput({
  value,
  onPress,
  source,
  placeholder,
  editable,
  onChangeText,
}) {
  return (
    <View
      style={[
        styles.whiteInput,
        { flexDirection: "row", justifyContent: "space-between" },
      ]}
    >
      <TextInput
        placeholder={placeholder}
        value={value}
        editable={editable}
        onChangeText={onChangeText}
      />
      <TouchableOpacity onPress={onPress} style={{ justifyContent: "center" }}>
        <Image
          source={source}
          style={{
            width: 10,
            height: 10,
            alignSelf: "center",
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

export function WhiteTextInput({
  placeholder,
  onChangeText,
  onChange,
  value,
  maxLength,
  secureTextEntry,
  keyboardType,
  onPressIn,
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
        keyboardType={keyboardType}
        onPressIn={onPressIn}
      />
    </>
  );
}

export function NewGoalInput({
  title,
  maxLength,
  onChangeText,
  onChange,
  value,
}) {
  return (
    <View style={styles.newGoalInput}>
      <Text style={styles.newGoalTitle}>{title}</Text>
      <TextInput
        placeholder="Type Here"
        onChangeText={onChangeText}
        onChange={onChange}
        value={value}
        autoCapitalize="none"
        maxLength={maxLength}
      />
    </View>
  );
}

export function BudgetInput({
  text,
  placeholder,
  style,
  keyboardType,
  onPressIn,
  value,
  onChangeText,
}) {
  return (
    <View style={[{ flexDirection: "column" }, style]}>
      <Header text={text} />
      <WhiteTextInput
        placeholder={placeholder}
        keyboardType={keyboardType}
        onPressIn={onPressIn}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

export function YesOrNo({ title }) {
  const data = [{ label: "Yes" }, { label: "No" }];
  return (
    <View style={styles.newGoalInput}>
      <Text style={styles.newGoalTitle}>{title}</Text>
      <RadioButtonRN
        data={data}
        box={false}
        circleSize={10}
        deactiveColor={colours.white}
        initial={2}
      />
    </View>
  );
}

export const styles = StyleSheet.create({
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
    fontSize: 15,
    lineHeight: 15,
    marginVertical: 5,
  },
  newGoalInput: {
    backgroundColor: colours.lightBrown,
    borderRadius: 15,
    margin: 5,
    padding: 10,
  },
  newGoalTitle: {
    color: "#6C757D",
    fontSize: 12,
  },
  title: {
    fontWeight: "500",
    fontSize: 20,
    color: "#000",
    lineHeight: 20,
    marginTop: 20,
  },
  whiteInput: {
    backgroundColor: "#fff",
    borderWidth: 0.8,
    borderColor: "#251F47",
    borderRadius: 5,
    shadowColor: "#000",
    marginVertical: 5,
    shadowOpacity: 0,
    shadowRadius: 1,
    elevation: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
});
export default reusableText;
