import { body, validationResult } from "express-validator";
import PromoCode from "../models/promoCodeModel.js";
import Hotels from "../models/hotelModel.js";
import Users from "../models/accountsModel.js";

const date = new Date();

const addPromoCode = [
  body("code")
    .notEmpty()
    .withMessage("code must not be empty")
    .isString()
    .withMessage("code must be string")
    .custom(async (code) => {
      const promoCode = await PromoCode.findOne({ code });
      if (promoCode)
        return Promise.reject(
          new Error("there is an promoCode with the same code")
        );
    }),
  body("expirationDate")
    .notEmpty()
    .withMessage("expirationDate must not be empty")
    .isObject()
    .withMessage("expirationDate must not be object"),
  body("expirationDate.year")
    .notEmpty()
    .withMessage("expirationDate.year must not be empty")
    .isInt({ min: date.getFullYear() })
    .withMessage(
      `expirationDate.year must be Int and over ${date.getFullYear()}`
    ),
  body("expirationDate.month")
    .notEmpty()
    .withMessage("expirationDate.month must not be empty")
    .isInt({ min: 1, max: 12 })
    .withMessage(`expirationDate.month must be Int and between 1 to 12`)
    .custom((month, { req }) => {
      if (req.body.expirationDate.year == date.getFullYear()) {
        if (month < date.getMonth() + 1)
          return Promise.reject(
            new Error(
              `expirationDate.month must be Int and over ${date.getMonth() + 1}`
            )
          );
      }
      return true;
    }),
  body("expirationDate.day")
    .notEmpty()
    .withMessage("expirationDate.day must not be empty")
    .isInt()
    .withMessage(`expirationDate.day must be Int`)
    .custom((day, { req }) => {
      if (
        req.body.expirationDate.year == date.getFullYear() &&
        req.body.expirationDate.month == date.getMonth() + 1
      ) {
        if (day <= date.getDate())
          return Promise.reject(
            new Error(
              `expirationDate.day must be Int and over ${date.getDate()}`
            )
          );
        else return true;
      }
      return true;
    }),
  body("forAllHotels")
    .notEmpty()
    .withMessage("forAllHotels must not be empty")
    .isBoolean()
    .withMessage("forAllHotels must be boolean"),
  body("acceptedHotels")
    .isArray()
    .withMessage("acceptedHotels must be array")
    .custom((acceptedHotels, { req }) => {
      if (!req.body.forAllHotels)
        if (acceptedHotels.length == 0)
          return Promise.reject(
            new Error(`${acceptedHotels} must not be empty`)
          );
        else return true;
      return true;
    }),

  body("acceptedHotels.*")
    .notEmpty()
    .withMessage("acceptedHotels indexes must not be empty")
    .isString()
    .withMessage("acceptedHotels indexes must be string")
    .custom(async (acceptedHotels, { req }) => {
      const hotel = await Hotels.findById(acceptedHotels);
      if (!hotel)
        return Promise.reject(new Error(`there is no hotel with this Id`));
    }),
  body("forAllUsers")
    .notEmpty()
    .withMessage("forAllUsers must not be empty")
    .isBoolean()
    .withMessage("forAllUsers must be boolean"),
  body("users")
    .isArray()
    .withMessage("users must be array")
    .custom((users, { req }) => {
      if (req.body.forAllUsers == false)
        if (users.length == 0)
          return Promise.reject(new Error(`users must not be empty`));
        else return true;
      return true;
    }),
  body("users.*")
    .notEmpty()
    .withMessage("users indexes must not be empty")
    .isString()
    .withMessage("users indexes must be string")
    .custom(async (acceptedUsers, { req }) => {
      const user = await Users.findById(acceptedUsers);
      if (!user)
        return Promise.reject(new Error(`there is no user with this Id`));
    }),
  body("usedOneTimeOfUser")
    .notEmpty()
    .withMessage("forAllUsers must not be empty")
    .isBoolean()
    .withMessage("forAllUsers must be boolean"),
  body("offer")
    .notEmpty()
    .withMessage("offer must not be empty")
    .isObject()
    .withMessage("offer must be object"),
  body("offer.valueType")
    .notEmpty()
    .withMessage("valueType must not be empty")
    .isString()
    .withMessage("valueType must be string")
    .isIn(["precentageValue", "amount"])
    .withMessage('valueType must be one of them ["precentageValue", "amount"]'),
  body("offer.value")
    .notEmpty()
    .withMessage("valueType must not be empty")
    .isInt({ min: 0 })
    .withMessage("valueType must be int and bigger than 0"),
  body("infintyTimesToUse")
    .notEmpty()
    .withMessage("infintyTimesToUse must not be empty")
    .isBoolean()
    .withMessage("infintyTimesToUse must be boolean"),
  body("howManyToUse")
    .isInt()
    .withMessage("howManyToUse must be int")
    .custom((value, { req }) => {
      if (!req.body.infintyTimesToUse)
        if (typeof value != "number" || value <= 0)
          return Promise.reject(
            new Error(`howManyToUse must be int and over 0`)
          );
        else return true;
      return true;
    }),
];

const getPromoCodeById = [
  body("promoCodeId")
    .notEmpty()
    .withMessage("promoCodeId must not be empty")
    .isString()
    .withMessage("promoCodeId must be string")
    .isMongoId()
    .withMessage("promoCodeId must be mongoId")
    .custom(async (id) => {
      const promoCode = await PromoCode.findById(id);
      if (!promoCode)
        return Promise.reject(new Error(`there is no promoCode with this id`));
      else return;
    }),
];

const updatePromoCode = [
  body("promoCodeId")
    .notEmpty()
    .withMessage("promoCodeId must not be empty")
    .isString()
    .withMessage("promoCodeId must be string")
    .isMongoId()
    .withMessage("promoCodeId must be mongoId")
    .custom(async (id) => {
      const promoCode = await PromoCode.findById(id);
      if (!promoCode)
        return Promise.reject(new Error(`there is no promoCode with this id`));
    }),
  body("expirationDate")
    .optional()
    .isObject()
    .withMessage("expirationDate must not be object"),
  body("expirationDate.year")
    .notEmpty()
    .withMessage("expirationDate.year must not be empty")
    .isInt({ min: date.getFullYear() })
    .withMessage(
      `expirationDate.year must be Int and over ${date.getFullYear()}`
    ),
  body("expirationDate.month")
    .notEmpty()
    .withMessage("expirationDate.month must not be empty")
    .isInt({ min: 1, max: 12 })
    .withMessage(`expirationDate.month must be Int and between 1 to 12`)
    .custom((month, { req }) => {
      if (req.body.expirationDate.year == date.getFullYear()) {
        if (month < date.getMonth() + 1)
          return Promise.reject(
            new Error(
              `expirationDate.month must be Int and over ${date.getMonth() + 1}`
            )
          );
      }
      return true;
    }),
  body("expirationDate.day")
    .notEmpty()
    .withMessage("expirationDate.day must not be empty")
    .isInt()
    .withMessage(`expirationDate.day must be Int`)
    .custom((day, { req }) => {
      if (
        req.body.expirationDate.year == date.getFullYear() &&
        req.body.expirationDate.month == date.getMonth() + 1
      ) {
        if (day <= date.getDate())
          return Promise.reject(
            new Error(
              `expirationDate.day must be Int and over ${date.getDate()}`
            )
          );
        else return true;
      }
      return true;
    }),

  body("forAllHotels")
    .optional()
    .notEmpty()
    .withMessage("forAllHotels must not be empty")
    .isBoolean()
    .withMessage("forAllHotels must be boolean"),
  body("acceptedHotels")
    .isArray()
    .withMessage("acceptedHotels must be array")
    .custom((acceptedHotels, { req }) => {
      if (!req.body.forAllHotels)
        if (acceptedHotels.length == 0)
          return Promise.reject(
            new Error(`${acceptedHotels} must not be empty`)
          );
        else return true;
      return true;
    }),

  body("acceptedHotels.*")
    .notEmpty()
    .withMessage("acceptedHotels indexes must not be empty")
    .isString()
    .withMessage("acceptedHotels indexes must be string")
    .custom(async (acceptedHotels, { req }) => {
      const hotel = await Hotels.findById(acceptedHotels);
      if (!hotel)
        return Promise.reject(new Error(`there is no hotel with this Id`));
    }),
  body("forAllUsers")
    .optional()
    .notEmpty()
    .withMessage("forAllUsers must not be empty")
    .isBoolean()
    .withMessage("forAllUsers must be boolean"),
  body("users")
    .isArray()
    .withMessage("users must be array")
    .custom((users, { req }) => {
      if (req.body.forAllUsers == false)
        if (users.length == 0)
          return Promise.reject(new Error(`users must not be empty`));
        else return true;
      return true;
    }),
  body("users.*")
    .notEmpty()
    .withMessage("users indexes must not be empty")
    .isString()
    .withMessage("users indexes must be string")
    .custom(async (acceptedUsers, { req }) => {
      const user = await Users.findById(acceptedUsers);
      if (!user)
        return Promise.reject(new Error(`there is no user with this Id`));
    }),
  body("usedOneTimeOfUser")
    .optional()
    .notEmpty()
    .withMessage("forAllUsers must not be empty")
    .isBoolean()
    .withMessage("forAllUsers must be boolean"),
  body("offer")
    .optional()
    .notEmpty()
    .withMessage("offer must not be empty")
    .isObject()
    .withMessage("offer must be object"),
  body("offer.valueType")
    .notEmpty()
    .withMessage("valueType must not be empty")
    .isString()
    .withMessage("valueType must be string")
    .isIn(["precentageValue", "amount"])
    .withMessage('valueType must be one of them ["precentageValue", "amount"]'),
  body("offer.value")
    .notEmpty()
    .withMessage("valueType must not be empty")
    .isInt({ min: 0 })
    .withMessage("valueType must be int and bigger than 0"),
  body("infintyTimesToUse")
    .optional()
    .notEmpty()
    .withMessage("infintyTimesToUse must not be empty")
    .isBoolean()
    .withMessage("infintyTimesToUse must be boolean"),
  body("howManyToUse")
    .isInt()
    .withMessage("howManyToUse must be int")
    .custom((value, { req }) => {
      if (!req.body.infintyTimesToUse)
        if (typeof value != "number" || value <= 0)
          return Promise.reject(
            new Error(`howManyToUse must be int and over 0`)
          );
        else return true;
      return true;
    }),
];

const deletePromoCode = [
  body("promoCodeId")
    .notEmpty()
    .isString()
    .isMongoId()
    .custom(async (id) => {
      const promoCode = await PromoCode.findById(id);
      if (!promoCode)
        return Promise.reject(new Error(`there is no promoCode with this id`));
    }),
];

export default {
  addPromoCode,
  getPromoCodeById,
  updatePromoCode,
  deletePromoCode,
};
