import { Router } from "express";
const router = Router();

import authorization from "../middleware/authorization.js";
import localValidationFunction from "../validator/localValidationFunction.js";
import roleValidator from "../validator/roleValidator.js";
import roleController from "../controllers/roleController.js";

// @route   POST api/role/
// @desc    Add role
// @access  Private
const addRoleProperties = ["roleName", "description", "permissions"];
router.post(
  "/",
  authorization.AdminAuthorization,
  localValidationFunction.validateBodyProperties(addRoleProperties),
  roleValidator.addRole,
  localValidationFunction.errorHandler,
  roleController.addRole_post
);

// @route   GET api/role/
// @desc    get all roles
// @access  Private
router.get(
  "/",
  authorization.AdminAuthorization,
  roleController.getAllRoles_get
);

// @route   PUT api/role/
// @desc    update role
// @access  Private
const updateRoleProperties = [
  "roleId",
  "roleName",
  "description",
  "permissions",
];
router.put(
  "/",
  authorization.AdminAuthorization,
  localValidationFunction.validateBodyProperties(updateRoleProperties),
  roleValidator.updateRole,
  localValidationFunction.errorHandler,
  roleController.updateRole_put
);

// @route   DELETE api/role/
// @desc    delete role
// @access  Private
const deleteRoleProperties = ["roleId", "roleName"];
router.delete(
  "/",
  authorization.AdminAuthorization,
  localValidationFunction.validateBodyProperties(deleteRoleProperties),
  roleValidator.deleteRole,
  localValidationFunction.errorHandler,
  roleController.deleteRole_delete
);

export default router;
