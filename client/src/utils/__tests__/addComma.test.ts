import { addComma } from "@/utils/addComma";

describe("addComma 函式", () => {
  test("空值和未定義時回傳空字串", () => {
    expect(addComma(null)).toBe("");
    expect(addComma(undefined)).toBe("");
  });

  test("正確格式化零", () => {
    expect(addComma(0)).toBe("0");
    expect(addComma("0")).toBe("0");
  });

  test("正確格式化數字", () => {
    expect(addComma(1234567)).toBe("1,234,567");
  });

  test("正確格式化負數", () => {
    expect(addComma(-1234567)).toBe("-1,234,567");
  });

  test("正確格式化小數", () => {
    expect(addComma(1234567.89)).toBe("1,234,568");
  });

  test("非數字字串回傳空字串", () => {
    expect(addComma("abc")).toBe("");
  });

  test("空字串回傳空字串", () => {
    expect(addComma("")).toBe("");
  });
});
