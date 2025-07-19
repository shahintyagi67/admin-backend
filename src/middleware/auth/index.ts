// import jwt, { JwtPayload } from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";

// declare module "express-serve-static-core" {
//   interface Request {
//     user?: string | JwtPayload;
//   }
// }

// export const userAuth = (req: Request, res: Response, next: NextFunction): void | Promise<void> => {
//   const authHeader = req.headers.authorization;
//   const token = authHeader?.split(" ")[1];

//   if (!token) {
//     res.status(401).json({ message: "Unauthorized" });
//     return;
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//     req.user = decoded;
//     next();
//   } catch (err) {
//      res.status(401).json({ message: "Token is Invalid or Expired" });
//      return;
//   }
// };


import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Define your custom payload type
interface CustomJwtPayload extends JwtPayload {
  id: string;
}

// Extend Express Request type globally
declare module "express-serve-static-core" {
  interface Request {
    user?: CustomJwtPayload;
  }
}

export const userAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;

    if (!decoded.id) {
      res.status(401).json({ message: "Token missing user ID" });
      return;
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is Invalid or Expired" });
  }
};
