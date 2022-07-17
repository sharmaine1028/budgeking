import { hello } from "../config/helloTest.js";

describe("hello", () => {
  it("should output hello", () => {
    expect(hello()).toBe("Hello");
  });
});
