import { Router } from "express";
const router = Router();

import accounts from "../controllers/AccountsController.js";
import userValidator from "../validator/userValidator.js";
import authorization from "../middleware/authorization.js";
import localValidationFunction from "../validator/localValidationFunction.js";
import authentication from "../middleware/authentication.js";

// @route   PSOT api/accounts/
// @desc    Create an user
// @access  Public
router.post(
  "/",
  userValidator.validateSignup,
  localValidationFunction.errorHandler,
  accounts.add_account_post
);

// @route   POST api/accounts/login
// @desc    Login
// @access  Public

router.post(
  "/login",
  userValidator.validateLogin,
  localValidationFunction.errorHandler,
  authentication.userAuthentication,
  accounts.login_post
);

// @route   GET api/accounts/users
// @desc    Get all accounts
// @access  Private
router.get("/users", authorization.AdminAuthorization, accounts.allUsers_get);

// @route   POST api/accounts/user
// @desc    Get account by ID
// @access  Private
router.post(
  "/user",
  authorization.AdminAuthorization,
  userValidator.getUser,
  localValidationFunction.errorHandler,
  accounts.getUserById_post
);

// @route   PATCH api/accounts/changePassword/admin
// @desc    change password by the admin
// @access  Private Admin

router.patch(
  "/changePassword/admin",
  authorization.AdminAuthorization,
  userValidator.changePasswordByAdmin,
  localValidationFunction.errorHandler,
  accounts.updateAccountPassword_admin_patch
);

// @route   PATCH api/accounts/changePassword/
// @desc    change password by the user
// @access  Public

router.patch(
  "/changePassword/",
  authorization.UserAuthorization,
  userValidator.changePassword,
  localValidationFunction.errorHandler,
  accounts.updateAccountPassword_user_patch
);

// @route   PUT api/accounts/
// @desc    Update user data
// @access  Public
router.put(
  "/",
  authorization.UserAuthorization,
  userValidator.updateUser,
  localValidationFunction.errorHandler,
  accounts.updatedUser_put
);

// @route   DELETE api/accounts/:id
// @desc    Delete account by ID
// @access  Private User
router.delete("/", authorization.UserAuthorization, accounts.delete_user);

export default router;
