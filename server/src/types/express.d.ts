import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      userId?: Types.ObjectId;
      role?: string;
    }
  }
}

declare namespace Express {
  interface Request {
    session?: {
      user?: {
        role?: string;
        [key: string]: any;
      };
      [key: string]: any;
    };
  }
}

declare module "express-session" {
  interface SessionData {
    user?: {
      role?: string;
      [key: string]: any;
    };
  }
}
