export const isExist = (value: unknown): boolean =>
  value !== null &&
  value !== "" &&
  typeof value !== "undefined" &&
  value !== false;
