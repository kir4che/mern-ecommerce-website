import { addComma } from "@/utils/addComma";

describe("addComma function", () => {
  test("returns empty string for null", () => {
    expect(addComma(null)).toBe("");
  });

  test("returns empty string for undefined", () => {
    expect(addComma(undefined)).toBe("");
  });

  test("formats number correctly", () => {
    expect(addComma(1234567)).toBe("1,234,567");
  });

  test("formats string number correctly", () => {
    expect(addComma("1234567")).toBe("1,234,567");
  });

  test("formats negative number correctly", () => {
    expect(addComma(-1234567)).toBe("-1,234,567");
  });

  test("formats decimal number correctly", () => {
    expect(addComma(1234567.89)).toBe("1,234,568");
  });

  test("returns empty string for non-numeric string", () => {
    expect(addComma("abc")).toBe("");
  });

  test("returns empty string for empty string", () => {
    expect(addComma("")).toBe("");
  });
});
