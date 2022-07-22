import * as React from "react";
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
import { render, screen } from "@testing-library/react-native";
import { ChangeUsername, ChangePassword } from "../config/reusableText";

describe("testing setting components", () => {
  test("changeusername should render without throwing an error", async () => {
    render(<ChangeUsername />);
    const username = await screen.queryByText("Change username");
    expect(username).toBeTruthy();
  });
  test("changepassword should render without throwing an error", async () => {
    render(<ChangePassword />);
    const password = await screen.queryByText("Change password");
    expect(password).toBeTruthy();
  });
});
