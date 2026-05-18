import bcrypt from "bcrypt";
import employeeService from "../services/employeeService.js";
import JWT from "jsonwebtoken";
import envConfig from "../config/envConfig.js";
import asyncHandler from "../utils/asyncHandler.js";

const sanitizeEmployee = (employee) => ({
  _id: employee._id,
  fullName: employee.fullName,
  email: employee.email,
  role: employee.role,
});

const addEmployee_post = asyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const data = { fullName, email, password: hashedPassword, role };
  const employee = await employeeService.addEmployee(data);
  const Token = JWT.sign(
    { _id: employee._id, title: "Employee" },
    envConfig.JWT.secret,
    { expiresIn: envConfig.JWT.expire },
  );
  res.status(201).json({ employee: sanitizeEmployee(employee), Token });
});

const employeeLogin_post = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const employee = await employeeService.getEmpolyee({ email });
  const Token = JWT.sign(
    { _id: employee._id, title: "Employee" },
    envConfig.JWT.secret,
    { expiresIn: envConfig.JWT.expire },
  );
  res.status(200).json({ employee: sanitizeEmployee(employee), Token });
});

export default {
  addEmployee_post,
  employeeLogin_post,
};
