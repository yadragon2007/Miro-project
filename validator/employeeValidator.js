import { body, header } from "express-validator";
import Employee from "../models/employeeModel.js";
import Role from "../models/roleModel.js";

const addEmployee = [
  body("fullName")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be between 3 and 20 characters long"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be a string")
    .isEmail()
    .withMessage("Email is invalid")
    .normalizeEmail()
    .custom(async (email) => {
      const employee = await Employee.findOne({ email });
      if (employee) return Promise.reject(new Error(`Email already exists`));
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isString()
    .withMessage("Role must be a string")
    .custom(async (id) => {
      const role = await Role.findById(id);
      if (!role) return Promise.reject(new Error(`Role does not exist`));
      return true;
    }),
];

const employeeLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be a string")
    .isEmail()
    .withMessage("Email is invalid")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string"),
];
export default { addEmployee, employeeLogin };
