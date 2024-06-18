import { escapeXML } from "ejs";
import Role from "../models/roleModel.js";
import RoleServes from "../services/RoleServes.js";

const checkOwnerRole = async (req, res, next) => {
  try {
    const ownerRole = await Role.findOne({ roleName: "owner" });
    if (!ownerRole) createOwnerRole(req, res, next);
    else return next();
  } catch (error) {
    return res.status(500).send({ msg: `Internal Server Error`, error });
  }
};

const createOwnerRole = async (req, res, next) => {
  try {
    const ownerRoleData = {
      roleName: "owner",
      description: "Owner Role",
      fullAccess: true,
    };
    const error = await RoleServes.addRole(ownerRoleData);
    if (error)
      return res.status(500).send({ msg: `Internal Server Error`, error });
    else return next();
  } catch (error) {
    return res.status(500).send({ msg: `Internal Server Error`, error });
  }
};

export default { checkOwnerRole };
