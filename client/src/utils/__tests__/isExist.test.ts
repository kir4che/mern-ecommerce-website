import { isExist } from "@/utils/isExist";

describe("isExist function", () => {
  test("returns true for valid value", () => {
    expect(isExist("value")).toBe(true);
  });

  test("returns true for number 0", () => {
    expect(isExist(0)).toBe(true);
  });

  test("returns true for empty object", () => {
    expect(isExist({})).toBe(true);
  });

  test("returns false for null", () => {
    expect(isExist(null)).toBe(false);
  });

  test("returns true for empty array", () => {
    expect(isExist([])).toBe(true);
  });

  test("returns false for undefined", () => {
    expect(isExist(undefined)).toBe(false);
  });

  test("returns false for empty string", () => {
    expect(isExist("")).toBe(false);
  });

  test("returns false for false boolean", () => {
    expect(isExist(false)).toBe(false);
  });

  test("returns true for true boolean", () => {
    expect(isExist(true)).toBe(true);
  });
});
