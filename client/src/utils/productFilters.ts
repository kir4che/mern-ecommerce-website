import { Product } from '@/types/product';

export const CATEGORY_MAP = {
  bread: "麵包",
  cake: "蛋糕",
  cookie: "餅乾",
  other: "其他",
} as const;

type CategoryKey = keyof typeof CATEGORY_MAP;
type CategoryFilter = (products: Product[]) => Product[];

// 依照日期排序商品
const sortByDate = (a: Product, b: Product) => 
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

// 建立分類篩選器
const createCategoryFilter = (cat: CategoryKey): CategoryFilter => 
  (products: Product[]) => products
    .filter(item => item.categories.includes(CATEGORY_MAP[cat]))
    .sort(sortByDate);

// 根據分類篩選商品
export const filterProductsByCategory = (products: Product[], category: string): Product[] => {
  if (!products?.length) return [];

  const categoryFilters: Record<string, CategoryFilter> = {
    all: (products) => products.sort(sortByDate),
    recommend: (products) => products.slice(0, 5).sort(sortByDate),
    hot: (products) => products
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 10),
    bread: createCategoryFilter('bread'),
    cake: createCategoryFilter('cake'),
    cookie: createCategoryFilter('cookie'),
    other: createCategoryFilter('other'),
  };

  // 回傳篩選後的商品，如果沒有對應的篩選則回傳全部商品
  const filter = categoryFilters[category] || categoryFilters.all;
  return filter(products);
}; 