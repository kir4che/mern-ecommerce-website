import { addComma } from "@/utils/addComma";

describe("addComma", () => {
  test("returns empty string for null", () => {
    expect(addComma(null)).toBe("");
  });

  test("returns empty string for undefined", () => {
    expect(addComma(undefined)).toBe("");
  });

  test("returns empty string for NaN", () => {
    expect(addComma("abc")).toBe("");
  });

  test("formats number correctly", () => {
    expect(addComma(1234567)).toBe("1,234,567");
  });

  test("formats string number correctly", () => {
    expect(addComma("1234567")).toBe("1,234,567");
  });
});
