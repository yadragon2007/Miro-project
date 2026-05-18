import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import envConfig from "../config/envConfig.js";
import RoleServes from "../services/RoleServes.js";
import accountService from "../services/accountService.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const sanitizeAccount = (account) => ({
  _id: account._id,
  fullName: account.fullName,
  email: account.email,
  role: account.role,
  activation: account.activation,
  location: account.location,
});

const add_account_post = asyncHandler(async (req, res) => {
  const { fullName, email, password, location } = req.body;
  const data = { fullName, email, location };
  let salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(password, salt);
  data.password = hashedPassword;
  const { roleId } = await RoleServes.getRole({ roleName: "user" });
  data.role = roleId;
  const newAccount = await accountService.addAccount(data);
  const Token = jwt.sign(
    { id: newAccount._id, email: data.email, role: newAccount.role },
    envConfig.JWT.secret,
    { expiresIn: envConfig.JWT.expire },
  );
  req.session.Token = Token;
  res.status(201).send({ data: sanitizeAccount(newAccount), Token });
});

const login_post = asyncHandler(async (req, res) => {
  let { email, password } = req.body;
  const account = await accountService.getAccount({ email });
  const Token = jwt.sign(
    { id: account._id, email: account.email, role: account.role },
    envConfig.JWT.secret,
    { expiresIn: envConfig.JWT.expire },
  );
  res.status(200).send({ data: sanitizeAccount(account), Token });
});

const allUsers_get = asyncHandler(async (req, res) => {
  const users = await accountService.getAllAccounts();
  return res.status(200).send(users.map(sanitizeAccount));
});

const getUserById_post = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const user = await accountService.getAccountById(userId);
  return res.status(200).send(sanitizeAccount(user));
});

const updateAccountPassword_admin_patch = asyncHandler(async (req, res) => {
  const { id, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await accountService.getAccountById(id);
  if (!user) throw new AppError("User not found.", 404, 300);
  await accountService.updateAccountPassword(id, hashedPassword);
  const currentUser = await accountService.getAccountById(id);
  return res.status(200).send(sanitizeAccount(currentUser));
});

const updateAccountPassword_user_patch = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.auth.userId;
  if (newPassword !== confirmPassword)
    throw new AppError("Those passwords didn't match. Try again.", 400, 301);
  const user = await accountService.getAccountById(userId, "+password");
  const checkPassword = await bcrypt.compare(oldPassword, user.password);
  if (!checkPassword) throw new AppError("Password is false", 400, 302);
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await accountService.updateAccountPassword(userId, hashedPassword);
  return res.status(200).send("password updated successfully");
});

const updatedUser_put = asyncHandler(async (req, res) => {
  const userId = req.auth.userId;
  let data = {};
  if (req.body.fullName) data.fullName = req.body.fullName;
  if (req.body.email) data.email = req.body.email;
  if (req.body.location) data.location = req.body.location;
  await accountService.updateAccount(userId, data);
  const user = await accountService.getAccountById(userId);
  return res.status(200).send({
    message: "userData updated successflly",
    data: sanitizeAccount(user),
  });
});

const delete_user = asyncHandler(async (req, res) => {
  const userId = req.auth.userId;
  await accountService.deleteAccount(userId);
  return res.status(200).send("account removed");
});

export default {
  add_account_post,
  login_post,
  allUsers_get,
  getUserById_post,
  updateAccountPassword_admin_patch,
  updateAccountPassword_user_patch,
  updatedUser_put,
  delete_user,
};
