import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  act,
} from "@testing-library/react-native";

import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";

import App, { MyStack } from "../App";
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

afterEach(cleanup);

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
    render(<App />);
    const signUpLink = await screen.findByText("Sign up");
    expect(signUpLink).toBeTruthy();

    act(() => {
      fireEvent(signUpLink, "onPress");

      expect(screen.toJSON()).toMatchSnapshot();
    });
  });
});
