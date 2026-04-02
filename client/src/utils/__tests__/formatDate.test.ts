import { formatDate } from "@/utils/formatDate";

describe("formatDate 函式", () => {
  test("正確格式化 ISO 8601 日期", () => {
    expect(formatDate("2023-01-01T00:00:00Z")).toBe("2023/01/01");
  });

  test("無效日期時回傳空字串", () => {
    expect(formatDate("invalid-date")).toBe("");
  });
});
