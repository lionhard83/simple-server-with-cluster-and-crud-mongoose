import express, { NextFunction, Request, Response } from "express";
import { connect } from "mongoose";

const app = express();
const psw = "YOUR_PASSWORD";
const url = `mongodb+srv://test:${psw}@cluster0.jaszgdy.mongodb.net/`;
import users from "./routes/users";

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

app.listen(PORT, () => console.log(`Server is runnning on port: ${PORT}`));
