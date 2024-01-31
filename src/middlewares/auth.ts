import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtSalt } from "../routes/auth";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.headers);
  try {
    const response = jwt.verify(String(req.headers.token), jwtSalt);
    res.locals.user = response;
    next();
  } catch (err) {
    return res.status(401).json({ message: "You are not auth!" });
  }
};
