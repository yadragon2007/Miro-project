import { Router } from "express";
const router = Router();

import activation from "../controllers/accountsActivationController.js";
import authorization from "../middleware/authorization.js";

// @route   POST api/activation/
// @desc    Send activation url
// @access  Public
router.post(
  "/",
  authorization.UserAuthorization,
  activation.account_activation_post
);


// @route   GET api/activation/:id/:token
// @desc    check if token is valid
// @access  Public
router.get(
  "/:id/:token",
  authorization.activation,
  activation.check_account_activation_get
);

export default router;
