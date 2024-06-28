import bcrypt from "bcrypt";
import Accounts from "../models/accountsModel.js";
import jwt from "jsonwebtoken";
import envConfig from "../config/envConfig.js";

// @route   PSOT api/accounts/
// @desc    Create an user
// @access  Public
const add_account_post = async (req, res) => {
  try {
    const data = req.body;
    // hash the password
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(data.password, salt);
    data.password = hashedPassword;
    // save
    // const newAccount = new Accounts({...data,role})
    // create a TOKEN
    const Token = jwt.sign(
      { id: newAccount._id, email: data.email, role: newAccount.role },
      envConfig.JWT.secret,
      { expiresIn: envConfig.JWT.expire }
    );
    req.session.Token = Token;
    res.status(201).send({ data: req.body, Token });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

// @route   POST api/accounts/login
// @desc    Login
// @access  Public
const login_post = async (req, res) => {
  let { email, password } = req.body;
  try {
    const account = await Accounts.findOne({ email });

    // create a TOKEN
    const Token = jwt.sign(
      { id: account._id, email: account.email, role: account.role },
      envConfig.JWT.secret,
      { expiresIn: envConfig.JWT.expire }
    );

    res.status(200).send({ data: account, Token });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

// @route   GET api/accounts/users
// @desc    Get all accounts
// @access  Private
const allUsers_get = async (req, res) => {
  const users = await Accounts.find();
  return res.status(200).send(users);
};

// @route   POST api/accounts/user
// @desc    Get account by ID
// @access  Private
const getUserById_post = async (req, res) => {
  const { userId } = req.body;
  const user = await Accounts.findById(userId);
  return res.status(200).send(user);
};

// @route   PATCH api/accounts/changePassword/admin
// @desc    change password by the admin
// @access  Private Admin
const updateAccountPassword_admin_patch = async (req, res) => {
  const { id, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Accounts.findById(id);
    if (!user) return res.status(404).send("User not found.");

    const updatedUser = await Accounts.findByIdAndUpdate(id, {
      password: hashedPassword,
      whenPasswordChanged: Date.now(),
    });
    const currentUser = await Accounts.findById(id);

    return res.status(200).send(currentUser);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// @route   PATCH api/accounts/changePassword/
// @desc    change password by the user
// @access  Public
const updateAccountPassword_user_patch = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword, userId } = req.body;
  if (newPassword !== confirmPassword)
    return res.status(400).send("Those passwords didn’t match. Try again.");

  const user = await Accounts.findById(userId);

  const checkPassword = await bcrypt.compare(oldPassword, user.password);
  if (!checkPassword) return res.status(400).send("Password is fales");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await Accounts.findByIdAndUpdate(userId, {
    password: hashedPassword,
    whenPasswordChanged: Date.now(),
  });

  return res.status(200).send("password updated successfully");
};

// @route   PUT api/accounts/
// @desc    Update user data
// @access  Public
const updatedUser_put = async (req, res) => {
  const { userId } = req.body;
  let data = {};

  if (req.body.fullName) data.fullName = req.body.fullName;
  if (req.body.email) data.email = req.body.email;
  if (req.body.location) data.location = req.body.location;

  try {
    await Accounts.findByIdAndUpdate(userId, data);
    const user = await Accounts.findById(userId);

    return res.status(200).send({
      message: "userData updated successflly",
      data: user,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// @route   DELETE api/accounts/:id
// @desc    Delete account by ID
// @access  Private User
const delete_user = async (req, res) => {
  const { userId } = req.body;
  try {
    await Accounts.findByIdAndDelete(userId);
    return res.status(200).send("account removed");
  } catch (error) {
    res.status(500).send({ message: error });
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
