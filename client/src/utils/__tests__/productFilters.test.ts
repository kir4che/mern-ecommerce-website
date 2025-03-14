import { filterProductsByCategory } from "@/utils/productFilters";

describe("filterProductsByCategory function", () => {
  const products = [
    { categories: ["麵包"], tags: [] },
    { categories: ["蛋糕"], tags: ["推薦"] },
    { categories: ["餅乾"], tags: ["熱銷"] },
  ];

  test("filters products by category", () => {
    const result = filterProductsByCategory(products, "bread");
    expect(result).toEqual([products[0]]);
  });

  test("returns all products for 'all' category", () => {
    const result = filterProductsByCategory(products, "all");
    expect(result).toEqual(products);
  });

  test("handles empty product array", () => {
    const result = filterProductsByCategory([], "bread");
    expect(result).toEqual([]);
  });

  test("returns all products for non-matching category", () => {
    const result = filterProductsByCategory(products, "non-existent");
    expect(result).toEqual(products);
  });

  test("filters products by recommend tag", () => {
    const result = filterProductsByCategory(products, "recommend");
    expect(result).toEqual([products[1]]);
  });

  test("filters products by hot tag", () => {
    const result = filterProductsByCategory(products, "hot");
    expect(result).toEqual([products[2]]);
  });
});
