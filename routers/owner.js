import { Router } from "express";
const router = Router();

import authorization from "../middleware/authorization.js";
import authentication from "../middleware/authentication.js";
import localValidationFunction from "../validator/localValidationFunction.js";
import ownerValidator from "../validator/ownerValidator.js";
import ownerController from "../controllers/ownerController.js";

// @route   POST api/owner/login
// @desc    owner login
// @access  Private
router.post(
  "/login",
  ownerValidator.ownerLogin,
  localValidationFunction.errorHandler,
  authentication.ownerAuthentication,
  ownerController.ownerlogin_post
);

// @route   POST api/owner/login
// @desc    owner login
// @access  Private
router.patch(
  "/",
  authorization.AdminAuthorization,
  ownerValidator.ownerLogin,
  localValidationFunction.errorHandler,
  authentication.ownerAuthentication,
  ownerController.ownerlogin_post
);

export default router;
