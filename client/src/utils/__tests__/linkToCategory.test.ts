import { linkToCategory } from "@/utils/linkToCategory";
import { PRODUCT_CATEGORIES } from "@/constants/actionTypes";

describe("linkToCategory function", () => {
  test("creates correct category links", () => {
    PRODUCT_CATEGORIES.forEach(({ label, link }) => {
      // 確認 linkToCategory 對應的分類標籤正確指向對應的連結
      expect(linkToCategory[label]).toBe(link);
    });
  });
});
