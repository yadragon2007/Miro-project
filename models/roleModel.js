import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const roleSchema = new Schema(
  {
    roleName: { type: String, required: true, unique: true },
    description: String,
    fullAccess: { type: Boolean, default: false },
    permissions: [String],
  },
  { timestamps: true }
);

const Role = model("Role", roleSchema);

export default Role;
