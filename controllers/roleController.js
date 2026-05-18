import RoleServes from "../services/RoleServes.js";

const addRole_post = async (req, res) => {
  try {
    const { roleName, description, permissions } = req.body;
    const data = { roleName, description, permissions };
    await RoleServes.addRole(data);
    res.status(201).send({ message: "Role added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: `Internal Server Error` });
  }
};

const getAllRoles_get = async (req, res) => {
  try {
    const roles = await RoleServes.getAllRoles();
    res.status(200).send(roles);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: `Internal Server Error` });
  }
};

const getRole_post = async (req, res) => {
  try {
    const data = {};
    if (req.body.roleName) data.roleName = req.body.roleName;
    if (req.body.roleId) data._id = req.body.roleId;
    const role = await RoleServes.getRole(data);
    res.status(200).send(role);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: `Internal Server Error` });
  }
};

const updateRole_put = async (req, res) => {
  try {
    const { roleId: id, roleName, description, permissions } = req.body;
    const data = {};
    if (roleName !== undefined) data.roleName = roleName;
    if (description !== undefined) data.description = description;
    if (permissions !== undefined) data.permissions = permissions;
    const role = await RoleServes.updateRole(id, data);
    res.status(200).send({ message: "Role updated successfully", data: role });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: `Internal Server Error` });
  }
};

const deleteRole_delete = async (req, res) => {
  try {
    const data = {};
    if (req.body.roleId) data._id = req.body.roleId;
    if (req.body.roleName) data.roleName = req.body.roleName;
    await RoleServes.deleteRole(data);
    res.status(200).send({ message: "Role deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: `Internal Server Error` });
  }
};

export default {
  addRole_post,
  getAllRoles_get,
  getRole_post,
  updateRole_put,
  deleteRole_delete,
};
