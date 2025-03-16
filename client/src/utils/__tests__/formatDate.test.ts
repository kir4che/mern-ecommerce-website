import { formatDate } from "@/utils/formatDate";

describe("formatDate", () => {
  test("returns empty string for invalid date", () => {
    expect(formatDate("invalid-date")).toBe("");
  });

  test("formats date correctly", () => {
    expect(formatDate("2023-01-01")).toBe("2023/01/01");
  });
});
