import { body, validationResult, header } from "express-validator";
import currencyService from "../services/currencyService.js";
import Currency from "../models/currencyModel.js";

const addCurrency = [
  body("currencyCode")
    .notEmpty()
    .withMessage("currencyCode must not be empty")
    .isString()
    .withMessage("currencyCode must be string")
    .custom(async (currencyCode) => {
      const currnecy = await Currency.findOne({ currencyCode });
      if (currnecy)
        return Promise.reject(new Error(`this currnecy code is already used`));
    })
    .custom(async (currencyCode) => {
      const allCodes = await currencyService.supportedCurrencyCodes();
      const check = allCodes.supported_codes.find((c) => c[0] === currencyCode);
      if (!check)
        return Promise.reject(new Error(`this currnecy code is not spported`));
      else return;
    }),
  body("symbol")
    .notEmpty()
    .withMessage("symbol must not be empty")
    .isString()
    .withMessage("symbol must be string"),
  body("thousands_separator")
    .notEmpty()
    .withMessage("thousands_separator must not be empty")
    .isString()
    .withMessage("thousands_separator must be string"),
  body("decimal_separator")
    .notEmpty()
    .withMessage("decimal_separator must not be empty")
    .isString()
    .withMessage("decimal_separator must be string"),
];

const getSpecificCurrency = [
  body("currencyCode")
    .optional()
    .notEmpty()
    .withMessage("currencyCode must not be empty")
    .isString()
    .withMessage("currencyCode must be string")
    .custom(async (currencyCode) => {
      const currnecy = await Currency.findOne({ currencyCode });
      if (!currnecy)
        return Promise.reject(new Error(`this currnecy code is not avilable`));
    }),
  body("_id")
    .optional()
    .notEmpty()
    .withMessage("_id must not be empty")
    .isString()
    .withMessage("_id must be string")
    .custom(async (_id) => {
      const currnecy = await Currency.findOne({ _id });
      if (!currnecy)
        return Promise.reject(new Error(`this currnecy Id is not avilable`));
    }),
];

const updateCurrency = [
  body("currencyId")
    .notEmpty()
    .withMessage("currencyId must not be empty")
    .isString()
    .withMessage("currencyId must be string")
    .isMongoId()
    .withMessage("currencyId must be mongo id")
    .custom(async (currencyId) => {
      const currnecy = await Currency.findById(currencyId);
      if (!currnecy)
        return Promise.reject(new Error(`this currnecy id is invalid`));
    }),
  body("currencyCode")
    .optional()
    .notEmpty()
    .withMessage("currencyCode must not be empty")
    .isString()
    .withMessage("currencyCode must be string")
    .custom(async (currencyCode, { req }) => {
      const currnecy = await Currency.findOne({ currencyCode });
      if (currnecy && req.body.currencyId !== currnecy._id)
        return Promise.reject(new Error(`this currnecy code is already used`));
    })
    .custom(async (currencyCode) => {
      const allCodes = await currencyService.supportedCurrencyCodes();
      const check = allCodes.supported_codes.find((c) => c[0] === currencyCode);
      if (!check)
        return Promise.reject(new Error(`this currnecy code is not spported`));
      else return;
    }),
  body("symbol")
    .optional()
    .notEmpty()
    .withMessage("symbol must not be empty")
    .isString()
    .withMessage("symbol must be string"),
  body("thousands_separator")
    .optional()
    .notEmpty()
    .withMessage("thousands_separator must not be empty")
    .isString()
    .withMessage("thousands_separator must be string"),
  body("decimal_separator")
    .optional()
    .notEmpty()
    .withMessage("decimal_separator must not be empty")
    .isString()
    .withMessage("decimal_separator must be string"),
];

const deleteCurrency = [
  body("currencyId")
    .notEmpty()
    .withMessage("currencyId must not be empty")
    .isString()
    .withMessage("currencyId must be string")
    .isMongoId()
    .withMessage("currencyId must be mongo id")
    .custom(async (currencyId) => {
      const currnecy = await Currency.findById(currencyId);
      if (!currnecy)
        return Promise.reject(new Error(`this currnecy id is invalid`));
    }),
];

export default {
  addCurrency,
  getSpecificCurrency,
  updateCurrency,
  deleteCurrency,
};
