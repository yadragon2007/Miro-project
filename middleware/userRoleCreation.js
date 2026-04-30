import Role from "../models/roleModel.js";
import RoleServes from "../services/RoleServes.js";

const checkUserRole = async (req, res, next) => {
  try {
    const userRole = await Role.findOne({ roleName: "user" });
    if (!userRole) createUserRole(req, res, next);
    else return next();
  } catch (error) {
    return res.status(500).send({ msg: `Internal Server Error`, error });
  }
};

const createUserRole = async (req, res, next) => {
  try {
    const userRoleData = {
      roleName: "user",
      description: "user Role",
      fullAccess: true,
    };
    const error = await RoleServes.addRole(userRoleData);
    if (error)
      return res.status(500).send({ msg: `Internal Server Error`, error });
    else return next();
  } catch (error) {
    return res.status(500).send({ msg: `Internal Server Error`, error });
  }
};

export default { checkUserRole };
