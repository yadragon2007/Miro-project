import { Router } from "express";
const router = Router();

import authorization from "../middleware/authorization.js";
import promoCodeValidator from "../validator/promoCodeValidator.js";
import promoCodeDataHandling from "../services/promoCodeDataHandling.js";
import promoCodeController from "../controllers/promoCodeController.js";
import localValidationFunction from "../validator/localValidationFunction.js";


// @route   POST api/promoCode/
// @desc    Add promoCode
// @access  Private
router.post(
  "/",
  authorization.AdminAuthorization,
  promoCodeValidator.addPromoCode,
  localValidationFunction.errorHandler,
  promoCodeDataHandling.setDate,
  promoCodeController.addPromoCode_post
);


// @route   GET api/promoCode/
// @desc    get all promoCodes
// @access  Private
router.get(
  "/",
  authorization.AdminAuthorization,
  promoCodeController.getAllPromoCode_get
);


// @route   GET api/promoCode/get
// @desc    get promoCode by id
// @access  Private
router.post(
  "/get",
  authorization.AdminAuthorization,
  promoCodeValidator.getPromoCodeById,
  localValidationFunction.errorHandler,
  localValidationFunction.validateBodyProperties(["promoCodeId"]),
  promoCodeController.getPromoCode_post
);


// @route   PUT api/promoCode/
// @desc    update promoCode []
// @access  Private
const updatePromoCodeProperties = [
  "promoCodeId",
  "expirationDate",
  "forAllHotels",
  "acceptedHotels",
  "forAllUsers",
  "users",
  "usedOneTimeOfUser",
  "offer",
  "infintyTimesToUse",
  "howManyToUse",
];
router.put(
  "/",
  authorization.AdminAuthorization,
  promoCodeValidator.updatePromoCode,
  localValidationFunction.errorHandler,
  localValidationFunction.validateBodyProperties(updatePromoCodeProperties),
  promoCodeDataHandling.setDate,
  promoCodeController.updatePromoCode_put
);

// @route   DELETE api/promoCode/
// @desc    delete promoCode
// @access  Private
router.delete(
  "/",
  authorization.AdminAuthorization,
  promoCodeValidator.deletePromoCode,
  localValidationFunction.errorHandler,
  promoCodeController.deletePromoCode_delete
);

export default router;
