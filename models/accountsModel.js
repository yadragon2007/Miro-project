import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const accountsSchema = new Schema(
  {
    fullName: { type: String, required: [true, "full name is required"] },
    email: {
      type: String,
      unique: [true, "this email is in use"],
      required: [true, "full name is required"],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "password is too short"],
    },
    whenPasswordChanged: Date,
    role: { type: Schema.Types.ObjectId , ref:"Role", required: true },
    activation: { type: Boolean, required: true, default: false, },
    location: {
      country: String,
      governorate: String,
      latitude: String,
      longitude: String,
    },
  },
  { timestamps: true }
);

const Accounts = model("Accounts", accountsSchema);

export default Accounts;
