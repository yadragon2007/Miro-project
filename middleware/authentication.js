import bcrypt from "bcrypt";
import Accounts from "../models/accountsModel.js";
import envConfig from "../config/envConfig.js";
import Owner from "../models/ownersModel.js";

const ownerAuthentication = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // check email
    const owner = await Owner.findOne({ email }).populate("role");
    // console.log(owner);
    if (!owner) return res.status(400).json({ message: "Invalid email" });
    // check password
    const passwordCheck = await bcrypt.compare(password, owner.password);
    if (!passwordCheck)
      return res.status(400).json({ message: "Invalid password" });
    // next
    next();
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

const userAuthentication = async (req, res, next) => {
  let { email, password } = req.body;
  try {
    const account = await Accounts.findOne({ email });
    if (!account) return res.status("401").send("email is false");
    const check = await bcrypt.compare(password, account.password);
    if (!check) return res.status("401").send("password is false");
    next();
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export default {
  ownerAuthentication,
  userAuthentication,
};
