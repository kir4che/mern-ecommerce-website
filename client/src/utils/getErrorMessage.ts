import { ERROR_CODE_MAP } from "@/constants/errorCodes";

type ApiError = {
  data?: {
    code?: string;
    message?: string;
  };
  status?: number;
};

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (!error || typeof error !== "object") return fallback;

  const data = "data" in error ? (error as ApiError).data : undefined;

  if (data?.code && ERROR_CODE_MAP[data.code]) return ERROR_CODE_MAP[data.code];

  const message = data?.message;
  if (typeof message === "string" && message.trim() !== "") return message;

  return fallback;
};

export const getErrorStatus = (error: unknown): number | undefined => {
  if (!error || typeof error !== "object") return undefined;
  const status = (error as ApiError).status;
  return typeof status === "number" ? status : undefined;
};
