import { isExist } from "@/utils/isExist";

describe("isExist 函式", () => {
  test("空值回傳假", () => {
    expect(isExist(null)).toBe(false);
  });

  test("未定義回傳假", () => {
    expect(isExist(undefined)).toBe(false);
  });

  test("空字串回傳假", () => {
    expect(isExist("")).toBe(false);
  });

  test("假值回傳假", () => {
    expect(isExist(false)).toBe(false);
  });

  test("零值回傳真", () => {
    expect(isExist(0)).toBe(true);
  });

  test("非空字串回傳真", () => {
    expect(isExist("hello")).toBe(true);
  });

  test("物件和陣列回傳真", () => {
    expect(isExist({})).toBe(true);
    expect(isExist([])).toBe(true);
  });
});
