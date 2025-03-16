import { linkToCategory } from "@/utils/linkToCategory";
import { PRODUCT_CATEGORIES } from "@/constants/actionTypes";

describe("linkToCategory", () => {
  test("creates correct category links", () => {
    PRODUCT_CATEGORIES.forEach(({ label, link }) => {
      expect(linkToCategory[label]).toBe(link);
    });
  });
});
