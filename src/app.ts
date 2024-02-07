import express, { NextFunction, Request, Response } from "express";
import { connect } from "mongoose";

const app = express();
const psw = "rXMMlCuyTYXe32MN";
// const url = `mongodb+srv://test:${psw}@cluster0.jaszgdy.mongodb.net/`;
const url = `mongodb://127.0.0.1:27017/test`;
import users from "./routes/users";
import companies from "./routes/companies";
import auth from "./routes/auth";

const PORT = 3000;

export const connection = connect(url)
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
