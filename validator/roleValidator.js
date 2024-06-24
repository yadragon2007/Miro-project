import { body, validationResult } from "express-validator";
import Role from "../models/roleModel.js";

const addRole = [
  body("roleName")
    .notEmpty()
    .withMessage("roleName must not be empty")
    .isString()
    .withMessage("roleName must be String")
    .custom(async (roleName) => {
      const role = await Role.findOne({ roleName });
      if (role)
        return Promise.reject(
          new Error(`there is a room with this name (${roleName})`)
        );
    }),
  body("description").isString().withMessage("roleName must be String"),
  body("permissions").isArray().withMessage("permissions must be array"),
  body("permissions.*")
    .notEmpty()
    .withMessage("permissions indexes must not be empty")
    .isString()
    .withMessage("permissions indexes must be string"),
];

const updateRole = [
  body("roleId")
    .notEmpty()
    .withMessage("roleId must not be empty")
    .isString()
    .withMessage("roleId must be string")
    .isMongoId()
    .withMessage("roleId must be valid mongoId")
    .custom(async (id) => {
      const role = await Role.findById(id);
      if (!role)
        return Promise.reject(
          new Error(`there is no role with this id (${id})`)
        );
    }),
  body("roleName")
    .notEmpty()
    .withMessage("roleName must not be empty")
    .isString()
    .withMessage("roleName must be String")
    .custom(async (roleName, { req }) => {
      const role = await Role.findOne({ roleName });
      if (role._id != req.body.roleId)
        return Promise.reject(
          new Error(`there is a room with this name (${roleName})`)
        );
    }),
  body("description").isString().withMessage("roleName must be String"),
  body("permissions").isArray().withMessage("permissions must be array"),
  body("permissions.*")
    .notEmpty()
    .withMessage("permissions indexes must not be empty")
    .isString()
    .withMessage("permissions indexes must be string"),
];

const deleteRole = [
  body("_id")
    .optional()
    .notEmpty()
    .withMessage("roleId must not be empty")
    .isString()
    .withMessage("roleId must be string")
    .isMongoId()
    .withMessage("roleId must be valid mongoId")
    .custom(async (id) => {
      const role = await Role.findById(id);
      if (!role)
        return Promise.reject(
          new Error(`there is no role with this id (${id})`)
        );
    }),
  body("roleName")
    .optional()
    .notEmpty()
    .withMessage("roleName must not be empty")
    .isString()
    .withMessage("roleName must be String")
    .custom(async (roleName, { req }) => {
      const role = await Role.findOne({ roleName });
      if (!role)
        return Promise.reject(
          new Error(`there is a room with this name (${roleName})`)
        );
    }),
];

export default { addRole, updateRole, deleteRole };
