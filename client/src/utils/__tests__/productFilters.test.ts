import { filterProductsByCategory } from "@/utils/productFilters";

describe("依分類篩選商品函式", () => {
  const products = [
    { categories: ["麵包"], tags: [] },
    { categories: ["蛋糕"], tags: ["推薦"] },
    { categories: ["餅乾"], tags: ["熱銷"] },
  ];

  test("依「分類」篩選商品", () => {
    const result = filterProductsByCategory(products, "bread");
    expect(result).toEqual([products[0]]);
  });

  test("分類為「全部」時回傳所有商品", () => {
    const result = filterProductsByCategory(products, "all");
    expect(result).toEqual(products);
  });

  test("處理空商品陣列", () => {
    const result = filterProductsByCategory([], "bread");
    expect(result).toEqual([]);
  });

  test("分類無符合時回傳所有商品", () => {
    const result = filterProductsByCategory(products, "non-existent");
    expect(result).toEqual(products);
  });

  test("依「推薦」篩選商品", () => {
    const result = filterProductsByCategory(products, "recommend");
    expect(result).toEqual([products[1]]);
  });

  test("依「熱銷」篩選商品", () => {
    const result = filterProductsByCategory(products, "hot");
    expect(result).toEqual([products[2]]);
  });
});
