import express, { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { body, matchedData, param, validationResult } from "express-validator";
import { checkValidation } from "../middlewares/validations";
import { v4 } from "uuid";
import jwt from "jsonwebtoken";

const router = express.Router();
import bcrypt from "bcrypt";
import { auth, jwtSalt } from "../middlewares/auth";
const salt = 10;

router.get("/me", auth, (req: Request, res: Response) => {
  res.json({ message: `Hello ${res.locals.user.name}` });
});

router.post(
  "/signup",
  body("name").trim(),
  body("email").isEmail(),
  body("password").trim().isStrongPassword(),
  body("avatar").trim().optional(),
  checkValidation,
  async (req: Request, res: Response) => {
    const user = matchedData(req);
    user.password = bcrypt.hashSync(user.password, salt);
    user.confirmedMailCode = v4();
    const newUsr = new User(user);
    const userSaved = await newUsr.save();

    res.status(201).json({
      name: userSaved.name,
      _id: userSaved._id,
      email: userSaved.email,
    });
    console.log(
      `ti mando una mail con un link a http://locahost:3000/auth/emailValidation/${user.confirmedMailCode}`
    );
  }
);

router.get(
  "/emailValidation/:uuid",
  param("uuid").isUUID(),
  checkValidation,
  async (req: Request, res: Response) => {
    const user = await User.findOne({ confirmedMailCode: req.params.uuid });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    user.isConfirmedMail = true;
    user.emailConfirmed = user.email;
    user.confirmedMailCode = undefined;
    await user.save();
    res.json({ message: "Validazione email eseguita con successo" });
  }
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").trim().isStrongPassword(),
  checkValidation,
  async (req: Request, res: Response) => {
    const body = matchedData(req);
    const user = await User.findOne({
      email: body.email,
      isConfirmedMail: true,
    });
    if (!user || !bcrypt.compareSync(req.body.password, user.password!)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      token: jwt.sign(
        {
          name: user.name,
          _id: user._id,
          email: user.email,
        },
        jwtSalt
      ),
    });
  }
);

export default router;
