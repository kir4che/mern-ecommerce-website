// Augment express-session and Express Request types so req.session and
// session.user are available in TypeScript without casting to `any`.

declare namespace Express {
  interface Request {
    // session is optional because not all requests may have session middleware
    session?: {
      // store a minimal user shape used across the app
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
