import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const employeeSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
  whenPasswordChanged: { type: Date, default: new Date() },
});

const Employee = model("Employee", employeeSchema);

export default Employee;
