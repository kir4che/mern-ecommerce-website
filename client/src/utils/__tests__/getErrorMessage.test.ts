import { getErrorMessage, getErrorStatus } from "@/utils/getErrorMessage";

describe("getErrorMessage", () => {
  const fallback = "Something went wrong";

  test("非物件錯誤時回傳 fallback", () => {
    expect(getErrorMessage(null, fallback)).toBe(fallback);
    expect(getErrorMessage(undefined, fallback)).toBe(fallback);
    expect(getErrorMessage("error string", fallback)).toBe(fallback);
  });

  test("錯誤沒有 data 屬性時回傳 fallback", () => {
    expect(getErrorMessage({}, fallback)).toBe(fallback);
  });

  test("data.message 未定義時回傳 fallback", () => {
    expect(getErrorMessage({ data: {} }, fallback)).toBe(fallback);
  });

  test("data.message 為空字串時回傳 fallback", () => {
    expect(getErrorMessage({ data: { message: "" } }, fallback)).toBe(fallback);
  });

  test("data.message 為非空字串時回傳該值", () => {
    const error = { data: { message: "Unauthorized" } };
    expect(getErrorMessage(error, fallback)).toBe("Unauthorized");
  });

  test("data.message 不是字串時回傳 fallback", () => {
    const error = { data: { message: 404 } };
    expect(getErrorMessage(error as unknown, fallback)).toBe(fallback);
  });
});

describe("getErrorStatus", () => {
  test("非物件錯誤時回傳未定義", () => {
    expect(getErrorStatus(null)).toBeUndefined();
    expect(getErrorStatus(undefined)).toBeUndefined();
    expect(getErrorStatus("error")).toBeUndefined();
  });

  test("錯誤沒有狀態時回傳未定義", () => {
    expect(getErrorStatus({})).toBeUndefined();
  });

  test("狀態不是數字時回傳未定義", () => {
    expect(getErrorStatus({ status: "404" })).toBeUndefined();
  });

  test("存在數字狀態時回傳該狀態", () => {
    expect(getErrorStatus({ status: 404 })).toBe(404);
  });

  test("0 作為有效狀態時回傳", () => {
    expect(getErrorStatus({ status: 0 })).toBe(0);
  });
});
