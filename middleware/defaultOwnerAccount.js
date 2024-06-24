import envConfig from "../config/envConfig.js";
import Owner from "../models/ownersModel.js";
import Role from "../models/roleModel.js";
import RoleServes from "../services/RoleServes.js";
import bcrypt from "bcrypt";
import ownerService from "../services/ownerService.js";

const checkOwnerAccount = async (req, res, next) => {
  try {
    const ownerAccount = await Owner.find();
    if (ownerAccount.length == 0) createOwnerAccount(req, res, next);
    else return next();
  } catch (error) {
    return res
      .status(500)
      .send({ code: 0, msg: `Internal Server Error`, error });
  }
};

const createOwnerAccount = async (req, res, next) => {
  try {
    // get owner role Id
    const ownerRole = await RoleServes.getRole("owner");

    if (!ownerRole._id)
      return res
        .status(500)
        .send({ code: 2, msg: `Internal Server Error`, error: ownerRole });
    // password hashing
    const password = envConfig.Email.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, 10);
    // add owner data
    const ownerAccountData = {
      fullName: "owner",
      email: envConfig.Email.email,
      password: hashedPassword,
      default: true,
      role: ownerRole._id,
    };
    // save owner
    const error = await ownerService.addOwner(ownerAccountData);
    if (error)
      return res
        .status(500)
        .send({ code: 3, msg: `Internal Server Error`, error });
    else return next();
  } catch (error) {
    return res
      .status(500)
      .send({ code: 4, msg: `Internal Server Error`, error });
  }
};

export default { checkOwnerAccount };
