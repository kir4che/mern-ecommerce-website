import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500;
  const message = err.message || "Unexpected error occurred.";
  const defaultCodeMap: Record<number, string> = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    500: "INTERNAL_SERVER_ERROR",
  };
  const code =
    err.code ||
    (defaultCodeMap[Number(statusCode)] ?? "INTERNAL_SERVER_ERROR");
  
  res.status(statusCode).json({
    success: false,
    code,
    message,
  });
};
