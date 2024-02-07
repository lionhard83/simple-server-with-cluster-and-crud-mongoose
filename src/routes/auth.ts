import express, { Request, Response } from "express";
import { body, matchedData, param } from "express-validator";
import { checkValidation } from "../middlewares/validations";
import { User } from "../models/User";
import { v4 } from "uuid";
import bcrypt from "bcrypt";
const router = express.Router();
const salt = 10;

router.post(
  "/signup",
  body("name").notEmpty().trim(),
  body("email").notEmpty().trim().isEmail(),
  body("password").notEmpty().trim().isStrongPassword(),
  body("avatar").isURL().optional(),
  checkValidation,
  async (req: Request, res: Response) => {
    const { name, email, password, avatar } = matchedData(req);
    const params = {
      name,
      email,
      avatar,
      confirmedCode: v4(),
      password: bcrypt.hashSync(password, salt),
    };
    try {
      const user = new User(params);
      await user.save();
      res.status(201).json({ message: "User created", id: user._id });
    } catch (err) {
      res.status(409).json({ err });
    }
  }
);

router.get(
  "/validate/:id",
  param("id").isUUID(),
  checkValidation,
  async (req: Request, res: Response) => {
    const user = await User.findOne({ confirmedCode: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.confirmedMail = true;
    user.confirmedCode = undefined;
    await user.save();
    res.json({ message: "User confirmeds" });
  }
);

router.post(
  "/login",
  body("email").trim().isEmail(),
  body("password").trim().isStrongPassword(),
  checkValidation,
  async (req: Request, res: Response) => {
    const user = await User.findOne({ email: req.body.email });
    const response = bcrypt.compareSync(req.body.password, user?.password!);
    if (!user || !response) {
      res.status(401).json({ message: "Invalid Credentials" });
    }
    res.json({ message: "Logged" });
  }
);

export default router;
