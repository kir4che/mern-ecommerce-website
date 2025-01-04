import { ProductCategories } from "@/constants/actionTypes";

export const linkToCategory = Object.fromEntries(
  ProductCategories.map(({ label, link }) => [label, link])
);