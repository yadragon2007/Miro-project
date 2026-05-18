import bcrypt from "bcrypt";
import Accounts from "../models/accountsModel.js";
import envConfig from "../config/envConfig.js";
import Owner from "../models/ownersModel.js";
import Employee from "../models/employeeModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const ownerAuthentication = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const owner = await Owner.findOne({ email })
    .select("+password")
    .populate("role");
  if (!owner) throw new AppError("Invalid credentials", 400, 100);
  const passwordCheck = await bcrypt.compare(password, owner.password);
  if (!passwordCheck) throw new AppError("Invalid credentials", 400, 100);
  next();
});

const employeeAuthentication = asyncHandler(async (req, res, next) => {
  let { email, password } = req.body;
  const account = await Employee.findOne({ email }).select("+password");
  if (!account) throw new AppError("Invalid credentials", 401, 101);
  const check = await bcrypt.compare(password, account.password);
  if (!check) throw new AppError("Invalid credentials", 401, 101);
  next();
});

const userAuthentication = asyncHandler(async (req, res, next) => {
  let { email, password } = req.body;
  const account = await Accounts.findOne({ email }).select("+password");
  if (!account) throw new AppError("Invalid credentials", 401, 102);
  const check = await bcrypt.compare(password, account.password);
  if (!check) throw new AppError("Invalid credentials", 401, 102);
  next();
});

export default {
  ownerAuthentication,
  employeeAuthentication,
  userAuthentication,
};
