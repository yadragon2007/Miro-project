import { Router } from "express";
const router = Router();

import authorization from "../middleware/authorization.js";
import currencyValidator from "../validator/currencyValidator.js";
import localValidationFunction from "../validator/localValidationFunction.js";
import currencyController from "../controllers/currencyController.js";

// @route   POST api/currency/
// @desc    add currency
// @access  Private
const addCurrencyProperties = [
  "currencyCode",
  "symbol",
  "thousands_separator",
  "decimal_separator",
];
router.post(
  "/",
  authorization.AdminAuthorization,
  localValidationFunction.validateBodyProperties(addCurrencyProperties),
  currencyValidator.addCurrency,
  localValidationFunction.errorHandler,
  currencyController.addCurrency_post
);

// @route   POST api/currency/get/
// @desc    add currency
// @access  Private
const getSpecificCurrencyProperties = ["currencyCode", "_id"];
router.post(
  "/get",
  authorization.AdminAuthorization,
  localValidationFunction.validateBodyProperties(getSpecificCurrencyProperties),
  currencyValidator.getSpecificCurrency,
  localValidationFunction.errorHandler,
  currencyController.getSpecificCurrency_post
);

// @route   GET api/currency/
// @desc    get all currencies
// @access  Private

router.get(
  "/",
  authorization.AdminAuthorization,
  currencyController.getAllCurrencies_get
);

// @route   PUT api/currency/
// @desc    update currency data
// @access  Private

const updateCurrencyProperties = [
  "currencyId",
  "currencyCode",
  "symbol",
  "thousands_separator",
  "decimal_separator",
];
router.put(
  "/",
  authorization.AdminAuthorization,
  localValidationFunction.validateBodyProperties(updateCurrencyProperties),
  currencyValidator.updateCurrency,
  localValidationFunction.errorHandler,
  currencyController.updateAllCurrencies_put
);

// @route   DELETE api/currency/
// @desc    delete currency
// @access  Private

const deleteCurrencyProperties = ["currencyId"];
router.delete(
  "/",
  authorization.AdminAuthorization,
  localValidationFunction.validateBodyProperties(deleteCurrencyProperties),
  currencyValidator.deleteCurrency,
  localValidationFunction.errorHandler,
  currencyController.deleteCurrency_delete
);

// @route   GET api/currency/api/getAllCurrenciesCodes
// @desc    get all currencies code
// @access  Private

router.get(
  "/api/getAllCurrenciesCodes",
  authorization.AdminAuthorization,
  currencyController.getAllCurrenciesCode_get
);

// @route   GET api/currency/api/conversionCurrency/:base/:target/:amount
// @desc    get all currencies code
// @access  Private

router.get(
  "/api/conversionCurrency/:base/:target/:amount",
  authorization.AdminAuthorization,
  currencyController.conversionCurrency_get
);
export default router;
