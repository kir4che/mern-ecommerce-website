import { formatDate } from "@/utils/formatDate";

describe("formatDate function", () => {
  test("formats date correctly", () => {
    expect(formatDate("2023-01-01")).toBe("2023/01/01");
  });

  test("formats ISO 8601 date correctly", () => {
    expect(formatDate("2023-01-01T00:00:00Z")).toBe("2023/01/01");
  });

  test("handles Unix timestamp", () => {
    expect(formatDate(new Date(1672531199000).toISOString())).toBe(
      "2023/01/01"
    );
  });

  test("returns empty string for invalid date", () => {
    expect(formatDate("invalid-date")).toBe("");
  });
});
