import { PRODUCT_CATEGORIES } from "@/constants/actionTypes";

export const linkToCategory = Object.fromEntries(
  PRODUCT_CATEGORIES.map(({ label, link }) => [label, link]),
);
