jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
    }),
  };
});

window.addEventListener = jest.fn();
window.attachEvent = jest.fn();
window.alert = jest.fn();
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
Date.now = jest.fn(() => 1503187200000);
jest.mock("@expo/vector-icons");
jest.mock("react-native-keyboard-aware-scroll-view");
