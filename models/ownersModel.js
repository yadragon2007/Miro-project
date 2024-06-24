import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const ownerSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
  default: { type: Boolean },
  whenPasswordChanged: { type: Date, default: new Date() },
});

const Owner = model("Owner", ownerSchema);

export default Owner;
