import { Schema, model } from "mongoose";

type User = {
  name: string;
  email: string;
  password: string;
  confirmedMail: boolean;
  confirmedCode?: string;
  avatar?: string;
};

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  confirmedMail: { type: Boolean, required: true, default: false },
  confirmedCode: { type: String },
  avatar: String,
});

export const User = model<User>("User", userSchema);
