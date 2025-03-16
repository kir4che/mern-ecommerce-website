import { isExist } from "@/utils/isExist";

describe("isExist", () => {
  test("returns false for null", () => {
    expect(isExist(null)).toBe(false);
  });

  test("returns false for undefined", () => {
    expect(isExist(undefined)).toBe(false);
  });

  test("returns false for empty string", () => {
    expect(isExist("")).toBe(false);
  });

  test("returns true for valid value", () => {
    expect(isExist("value")).toBe(true);
  });
});
