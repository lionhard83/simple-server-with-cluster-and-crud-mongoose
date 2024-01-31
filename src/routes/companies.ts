import express, { NextFunction, Request, Response } from "express";
import { Company } from "../models/Company";
import { body, matchedData, param, validationResult } from "express-validator";
import { checkValidation } from "../middlewares/validations";
import { auth } from "../middlewares/auth";
const router = express.Router();

// const app = express();

router.get("/pippo", () => {});

router.get("/", async (req: Request, res: Response) => {
  const users = await Company.find();
  res.json(users);
});

router.get(
  "/:id",
  param("id").isMongoId(),
  checkValidation,
  async (req: Request, res: Response) => {
    const company = await Company.findById(req.params.id);
    res.json(company);
  }
);

router.post(
  "/",
  auth,
  body("name").trim(),
  body("email").isEmail(),
  body("address").optional().trim(),
  checkValidation,
  async (req: Request, res: Response) => {
    try {
      const company = new Company(matchedData(req));
      const companyCreated = await company.save();
      res.json(companyCreated);
    } catch (err) {
      res.status(409).json(err);
    }
  }
);

export default router;
