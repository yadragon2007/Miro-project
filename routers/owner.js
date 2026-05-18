import { Router } from "express";
const router = Router();

import authorization from "../middleware/authorization.js";
import authentication from "../middleware/authentication.js";
import localValidationFunction from "../validator/localValidationFunction.js";
import ownerValidator from "../validator/ownerValidator.js";
import ownerController from "../controllers/ownerController.js";
import rateLimiter from "../middleware/rateLimiter.js";

// @route   POST api/owner/login
// @desc    owner login
// @access  Private
router.post(
  "/login",
  rateLimiter.authLimiter,
  ownerValidator.ownerLogin,
  localValidationFunction.errorHandler,
  authentication.ownerAuthentication,
  ownerController.ownerlogin_post
);

// @route   patch api/owner/password/change
// @desc    update owner's password
// @access  Private
const updatePasswordProperties = [
  "oldPassword",
  "newPassword",
  "confirmPassword",
];
router.patch(
  "/password/change",
  rateLimiter.sensitiveLimiter,
  authorization.AdminAuthorization,
  localValidationFunction.validateBodyProperties(
    updatePasswordProperties,
    true
  ),
  ownerValidator.changePassword,
  localValidationFunction.errorHandler,
  ownerController.changeOwnerPassword_patch
);

// @route   patch api/owner/
// @desc    update owner's data ["fullName", "email"]
// @access  Private
const updateOwnerProperties = ["fullName", "email"];
router.put(
  "/",
  authorization.AdminAuthorization,
  localValidationFunction.validateBodyProperties(updateOwnerProperties, true),
  ownerValidator.updateOwner,
  localValidationFunction.errorHandler,
  ownerController.updateOwner_put
);

// @route   patch api/owner/
// @desc    update owner's password
// @access  Private
const restOwnerProperties = ["password"];
router.delete(
  "/",
  authorization.AdminAuthorization,
  localValidationFunction.validateBodyProperties(restOwnerProperties, true),
  ownerValidator.updateOwner,
  localValidationFunction.errorHandler,
  ownerController.ownerRest_delete
);

export default router;
