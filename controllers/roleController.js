import RoleServes from "../services/RoleServes.js";
import asyncHandler from "../utils/asyncHandler.js";

const addRole_post = asyncHandler(async (req, res) => {
  const { roleName, description, permissions } = req.body;
  const data = { roleName, description, permissions };
  await RoleServes.addRole(data);
  res.status(201).send({ message: "Role added successfully" });
});

const getAllRoles_get = asyncHandler(async (req, res) => {
  const roles = await RoleServes.getAllRoles();
  res.status(200).send(roles);
});

const getRole_post = asyncHandler(async (req, res) => {
  const data = {};
  if (req.body.roleName) data.roleName = req.body.roleName;
  if (req.body.roleId) data._id = req.body.roleId;
  const role = await RoleServes.getRole(data);
  res.status(200).send(role);
});

const updateRole_put = asyncHandler(async (req, res) => {
  const { roleId: id, roleName, description, permissions } = req.body;
  const data = {};
  if (roleName !== undefined) data.roleName = roleName;
  if (description !== undefined) data.description = description;
  if (permissions !== undefined) data.permissions = permissions;
  const role = await RoleServes.updateRole(id, data);
  res.status(200).send({ message: "Role updated successfully", data: role });
});

const deleteRole_delete = asyncHandler(async (req, res) => {
  const data = {};
  if (req.body.roleId) data._id = req.body.roleId;
  if (req.body.roleName) data.roleName = req.body.roleName;
  await RoleServes.deleteRole(data);
  res.status(200).send({ message: "Role deleted successfully" });
});

export default {
  addRole_post,
  getAllRoles_get,
  getRole_post,
  updateRole_put,
  deleteRole_delete,
};
