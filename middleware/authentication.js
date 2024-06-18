import bcrypt from "bcrypt";
import Accounts from "../models/accountsModel.js";
import envConfig from "../config/envConfig.js";

const userAuthentication = async (req, res, next) => {
  let { email, password } = req.body;
  try {
    const account = await Accounts.findOne({ email });
    const check = await bcrypt.compare(password, account.password);
    if (!check) return res.status("401").send("password is false");
    next();
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export default {
  userAuthentication,
};
