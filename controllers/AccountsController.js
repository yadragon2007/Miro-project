import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import envConfig from "../config/envConfig.js";
import RoleServes from "../services/RoleServes.js";
import accountService from "../services/accountService.js";

const sanitizeAccount = (account) => ({
  _id: account._id,
  fullName: account.fullName,
  email: account.email,
  role: account.role,
  activation: account.activation,
  location: account.location,
});

// @route   PSOT api/accounts/
// @desc    Create an user
// @access  Public
const add_account_post = async (req, res) => {
  try {
    const { fullName, email, password, location } = req.body;
    const data = { fullName, email, location };
    // hash the password
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);
    data.password = hashedPassword;
    // get user role
    const { roleId } = await RoleServes.getRole({ roleName: "user" });
    data.role = roleId;
    // save
    const newAccount = await accountService.addAccount(data);
    // create a TOKEN
    const Token = jwt.sign(
      { id: newAccount._id, email: data.email, role: newAccount.role },
      envConfig.JWT.secret,
      { expiresIn: envConfig.JWT.expire },
    );
    req.session.Token = Token;
    res.status(201).send({ data: sanitizeAccount(newAccount), Token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

// @route   POST api/accounts/login
// @desc    Login
// @access  Public
const login_post = async (req, res) => {
  let { email, password } = req.body;
  try {
    const account = await accountService.getAccount({ email });

    // create a TOKEN
    const Token = jwt.sign(
      { id: account._id, email: account.email, role: account.role },
      envConfig.JWT.secret,
      { expiresIn: envConfig.JWT.expire },
    );

    res.status(200).send({ data: sanitizeAccount(account), Token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

// @route   GET api/accounts/users
// @desc    Get all accounts
// @access  Private
const allUsers_get = async (req, res) => {
  const users = await accountService.getAllAccounts();
  return res.status(200).send(users.map(sanitizeAccount));
};

// @route   POST api/accounts/user
// @desc    Get account by ID
// @access  Private
const getUserById_post = async (req, res) => {
  const { userId } = req.body;
  const user = await accountService.getAccountById(userId);
  return res.status(200).send(sanitizeAccount(user));
};

// @route   PATCH api/accounts/changePassword/admin
// @desc    change password by the admin
// @access  Private Admin
const updateAccountPassword_admin_patch = async (req, res) => {
  const { id, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await accountService.getAccountById(id);
    if (!user) return res.status(404).send("User not found.");

    const updatedUser = await accountService.updateAccountPassword(
      id,
      hashedPassword,
    );
    const currentUser = await accountService.getAccountById(id);
    return res.status(200).send(sanitizeAccount(currentUser));
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

// @route   PATCH api/accounts/changePassword/
// @desc    change password by the user
// @access  Public
const updateAccountPassword_user_patch = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.auth.userId;
  if (newPassword !== confirmPassword)
    return res.status(400).send("Those passwords didn’t match. Try again.");

  const user = await accountService.getAccountById(userId, "+password");

  const checkPassword = await bcrypt.compare(oldPassword, user.password);
  if (!checkPassword) return res.status(400).send("Password is fales");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await accountService.updateAccountPassword(userId, hashedPassword);

  return res.status(200).send("password updated successfully");
};

// @route   PUT api/accounts/
// @desc    Update user data
// @access  Public
const updatedUser_put = async (req, res) => {
  const userId = req.auth.userId;
  let data = {};

  if (req.body.fullName) data.fullName = req.body.fullName;
  if (req.body.email) data.email = req.body.email;
  if (req.body.location) data.location = req.body.location;

  try {
    await accountService.updateAccount(userId, data);
    const user = await accountService.getAccountById(userId);

    return res.status(200).send({
      message: "userData updated successflly",
      data: sanitizeAccount(user),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

// @route   DELETE api/accounts/:id
// @desc    Delete account by ID
// @access  Private User
const delete_user = async (req, res) => {
  const userId = req.auth.userId;
  try {
    await accountService.deleteAccount(userId);
    return res.status(200).send("account removed");
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

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
