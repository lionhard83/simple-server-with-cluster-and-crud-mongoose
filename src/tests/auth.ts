import request from "supertest";
import app, { connection } from "../app";
import * as assert from "assert";
import { User } from "../models/User";

describe("Auth Signup", () => {
  let userId: string;
  let userId2: string;
  before(async () => {
    await connection;
  });
  after(async () => {
    await User.findByIdAndDelete(userId);
    await User.findByIdAndDelete(userId2);
  });
  it("Status is running 200", async () => {
    const { status } = await request(app).get("/status");
    assert.equal(status, 200);
  });
  it("POST /auth/signup 400 wrong password", async () => {
    const { status } = await request(app).post("/auth/signup").send({
      name: "Carlo",
      email: "pippo@gmail.com",
      password: "passwordinsicura",
    });
    assert.equal(status, 400);
  });
  it("POST /auth/signup 400 missing name", async () => {
    const { status } = await request(app).post("/auth/signup").send({
      email: "pippo@gmail.com",
      password: "@389729nNJs",
    });
    assert.equal(status, 400);
  });
  it("POST /auth/signup 201", async () => {
    const { status, body } = await request(app).post("/auth/signup").send({
      name: "Carlo",
      email: "pippo@gmail.com",
      password: "Yoq@ndowi21389G",
    });
    assert.equal(status, 201);
    userId = body.id;
  });
  it("POST /auth/signup 409 duplicate email", async () => {
    const params = {
      name: "Carlo",
      email: "caiopippo@gmail.com",
      password: "Yoq@ndowi21389G",
    };
    const { body } = await request(app).post("/auth/signup").send(params);
    userId2 = body.id;
    const { status } = await request(app).post("/auth/signup").send(params);

    assert.equal(status, 409);
  });
});
