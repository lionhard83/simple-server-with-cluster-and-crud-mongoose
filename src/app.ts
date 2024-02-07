import express, { NextFunction, Request, Response } from "express";
import { connect } from "mongoose";
import path from "path";
require("dotenv").config({
  path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`),
});

const app = express();
import users from "./routes/users";
import companies from "./routes/companies";
import auth from "./routes/auth";
const PORT = 3000;
console.log(process.env);

export const connection = connect(process.env.MONGODB as string)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(`Couldn't connect to MongoDB: ${err}`);
  });

app.use(express.json());

app.get("/status", (req: Request, res: Response) => {
  res.json({ message: "Server is running!" });
});

app.use("/users", users);
app.use("/auth", auth);
app.use("/companies", companies);

app.listen(PORT, () => console.log(`Server is runnning on port: ${PORT}`));

export default app;
