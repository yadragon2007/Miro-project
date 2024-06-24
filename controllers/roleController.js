import RoleServes from "../services/RoleServes.js";

const addRole_post = async (req, res) => {
  try {
    const data = req.body;
    const error = await RoleServes.addRole(data);
    res.status(201).send({ message: "Role added successfully" });
  } catch (error) {
    return res.status(500).send({ msg: `Internal Server Error`, error });
  }
};

const getAllRoles_get = async (req, res) => {
  try {
    const roles = await RoleServes.getAllRoles();
    res.status(200).send(roles);
  } catch (error) {
    return res.status(500).send({ msg: `Internal Server Error`, error });
  }
};

const updateRole_put = async (req, res) => {
  try {
    const { roleId: id } = req.body;
    delete req.body.roleId;
    const data = req.body;
    const role = await RoleServes.updateRole(id, data);
    res.status(200).send({ message: "Role updated successfully", data: role });
  } catch (error) {
    return res.status(500).send({ msg: `Internal Server Error`, error });
  }
};

const deleteRole_delete = async (req, res) => {
  try {
    const data = req.body;
    await RoleServes.deleteRole(data);
    res.status(200).send({ message: "Role deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: `Internal Server Error`, error });
  }
};

export default {
  addRole_post,
  getAllRoles_get,
  updateRole_put,
  deleteRole_delete,
};
