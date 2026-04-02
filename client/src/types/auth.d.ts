import type { BaseResponse } from "./common";

export type UserRole = "admin" | "user";

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

export interface LoginParams {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ResetPasswordParams {
  email: string;
}

export interface ResetPasswordTokenParams {
  token: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthPayload {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export type AuthLoginResponse = BaseResponse & AuthPayload;
