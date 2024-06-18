import { Router } from "express";
const router = Router();

import authorization from "../middleware/authorization.js";
import localValidationFunction from "../validator/localValidationFunction.js";
import ownerValidator from "../validator/ownerValidator.js";
import ownerController from "../controllers/ownerController.js";

// @route   POST api/owner/
// @desc    owner login
// @access  Private
router.post(
  "/",
  ownerValidator.ownerLogin,
  localValidationFunction.errorHandler,
  ownerController.ownerlogin_post
);

export default router;
