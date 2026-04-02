import { PRODUCT_COLLECTIONS } from "@/constants/actionTypes";

export const linkToCategory = Object.fromEntries(
  PRODUCT_COLLECTIONS.map(({ label, value }) => [label, value])
);
