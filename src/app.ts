import express, { NextFunction, Request, Response } from "express";
import { connect } from "mongoose";

const app = express();
const psw = "rXMMlCuyTYXe32MN";
const url = `mongodb+srv://test:${psw}@cluster0.jaszgdy.mongodb.net/`;
import users from "./routes/users";
import companies from "./routes/companies";
import auth from "./routes/auth";

const PORT = 3000;

connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(`Couldn't connect to MongoDB: ${err}`);
  });

app.use(express.json());
app.use("/users", users);
app.use("/auth", auth);
app.use("/companies", companies);

app.listen(PORT, () => console.log(`Server is runnning on port: ${PORT}`));
