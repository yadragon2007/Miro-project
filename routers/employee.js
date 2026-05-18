import { Router } from "express";
const router = Router();

import authorization from "../middleware/authorization.js";
import employeeValidator from "../validator/employeeValidator.js";
import employeeController from "../controllers/employeeController.js";
import localValidationFunction from "../validator/localValidationFunction.js";
import authentication from "../middleware/authentication.js";
import rateLimiter from "../middleware/rateLimiter.js";

// @route   POST api/employee/
// @desc    Add employee
// @access  Private
router.post(
  "/",
  authorization.AdminAuthorization,
  employeeValidator.addEmployee,
  localValidationFunction.errorHandler,
  employeeController.addEmployee_post
);


// @route   POST api/employee/
// @desc    employee login
// @access  
router.post(
  "/login",
  rateLimiter.authLimiter,
  employeeValidator.employeeLogin,
  localValidationFunction.errorHandler,
  authentication.employeeAuthentication,
  employeeController.employeeLogin_post
);

export default router;
