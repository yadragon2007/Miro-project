import { Router } from "express";
const router = Router();

import authorization from "../middleware/authorization.js";
import promoCodeValidator from "../validator/promoCodeValidator.js";
import promoCodeDataHandling from "../services/promoCodeDataHandling.js";
import promoCodeController from "../controllers/promoCodeController.js";
import localValidationFunction from "../validator/localValidationFunction.js";


// @route   POST api/role/
// @desc    Add role
// @access  Private
router.post(
  "/",
  authorization.AdminAuthorization,
  promoCodeValidator.addPromoCode,
  localValidationFunction.errorHandler,
  promoCodeDataHandling.setDate,
  promoCodeController.addPromoCode_post
);


export default router;
