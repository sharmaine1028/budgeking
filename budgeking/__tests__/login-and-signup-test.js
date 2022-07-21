import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { render, screen, fireEvent } from "@testing-library/react-native";

import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";

import { MyStack } from "../App";

describe("Testing react navigation in login and sign up page", () => {
  test("Login page renders correctly", async () => {
    const component = (
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    );

    render(component);

    const loginButton = await screen.findByText("Login");

    expect(loginButton).toBeTruthy();
  });

  test("Clicking on sign up link takes you to sign up page", async () => {
    const component = (
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    );

    render(component);

    const loginButton = await screen.findByText("Login");

    fireEvent.press(loginButton);

    const signUpButton = await screen.findByText("Sign up");

    expect(signUpButton).toBeTruthy();
  });
});
