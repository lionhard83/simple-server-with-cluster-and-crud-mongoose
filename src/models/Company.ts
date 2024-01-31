import { Schema, model } from "mongoose";

type Company = {
  name: string;
  email: string;
  address?: string;
};

const companySchema = new Schema<Company>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: String,
});

export const Company = model("company", companySchema);
