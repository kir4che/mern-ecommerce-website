import { filterProductsByCategory } from "@/utils/productFilters";

describe("filterProductsByCategory", () => {
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
});
