import { Schema, model } from "mongoose";

type User = {
  name: string;
  email: string;
  emailConfirmed: string;
  password?: string;
  isConfirmedMail: boolean;
  confirmedMailCode?: string;
  avatar?: string;
};

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  emailConfirmed: { type: String, unique: true },
  password: { type: String, required: true },
  isConfirmedMail: { type: Boolean, default: false },
  confirmedMailCode: { type: String },
  avatar: String,
});

export const User = model<User>("User", userSchema);
