import Role from "../models/roleModel.js";

const addRole = async (roleData) => {
  try {
    const newRole = new Role(roleData);
    await newRole.save();
    return;
  } catch (error) {
    return error;
  }
};

const getRole = async (roleName) => {
  try {
    const role = await Role.findOne({ roleName });
    return role;
  } catch (error) {
    return error;
  }
};

export default {
  addRole,
  getRole
};
