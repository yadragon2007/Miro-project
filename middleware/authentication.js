import bcrypt from "bcrypt";
import Accounts from "../models/accountsModel.js";
import envConfig from "../config/envConfig.js";
import Owner from "../models/ownersModel.js";
import Employee from "../models/employeeModel.js";

const ownerAuthentication = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // check email
    const owner = await Owner.findOne({ email }).select("+password").populate("role");
    // console.log(owner);
    if (!owner) return res.status(400).json({ message: "Invalid credentials" });
    // check password
    const passwordCheck = await bcrypt.compare(password, owner.password);
    if (!passwordCheck)
      return res.status(400).json({ message: "Invalid credentials" });
    // next
    next();
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

const employeeAuthentication = async (req, res, next) => {
  let { email, password } = req.body;
  try {
    const account = await Employee.findOne({ email }).select("+password");
    if (!account) return res.status(401).send("Invalid credentials");
    const check = await bcrypt.compare(password, account.password);
    if (!check) return res.status(401).send("Invalid credentials");
    next();
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

const userAuthentication = async (req, res, next) => {
  let { email, password } = req.body;
  try {
    const account = await Accounts.findOne({ email }).select("+password");
    if (!account) return res.status(401).send("Invalid credentials");
    const check = await bcrypt.compare(password, account.password);
    if (!check) return res.status(401).send("Invalid credentials");
    next();
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export default {
  ownerAuthentication,
  employeeAuthentication,
  userAuthentication,
};
