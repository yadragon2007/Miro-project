import Role from "../models/roleModel.js";

const addRole = async (roleData) => {
  try {
    const newRole = new Role(roleData);
    await newRole.save();
    return;
  } catch (error) {
    if (error) throw error;
  }
};

const getAllRoles = async () => {
  try {
    const roles = await Role.find();
    return roles;
  } catch (error) {
    if (error) throw error;
  }
};

const getRole = async (data) => {
  try {
  
    const role = await Role.findOne(data);
    return role;
  } catch (error) {
    if (error) throw error;
  }
};

const updateRole = async (id, roleData) => {
  try {
    const role = await Role.findByIdAndUpdate(id, { roleData });
    return role;
  } catch (error) {
    if (error) throw error;
  }
};

const deleteRole = async (data) => {
  try {
    await Role.findOneAndDelete(data);
    return;
  } catch (error) {
    if (error) throw error;
  }
};
export default {
  addRole,
  getAllRoles,
  getRole,
  updateRole,
  deleteRole,
};
