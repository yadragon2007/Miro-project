import { body, validationResult } from "express-validator";
import PromoCode from "../models/promoCodeModel.js";
import Hotels from "../models/hotelModel.js";
import Users from "../models/accountsModel.js";

const ownerLogin = [
  body("email")
    .notEmpty()
    .withMessage("email can not be empty")
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .notEmpty()
    .withMessage("password can not be empty")
    .isString()
    .withMessage("password must be string"),
];
const changePassword = [
  body("oldPassword")
    .notEmpty()
    .withMessage("old password can not be empty")
    .isString()
    .withMessage("old password must be string"),
  body("newPassword")
    .notEmpty()
    .withMessage("new password can not be empty")
    .isString()
    .withMessage("new password must be string"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("confirm password can not be empty")
    .isString()
    .withMessage("confirm password must be string"),
];

const updateOwner = [
  body("fullName")
    .optional()
    .notEmpty()
    .withMessage("full name can not be empty")
    .isString()
    .withMessage("full name must be string"),
  body("email")
    .optional()
    .notEmpty()
    .withMessage("email can not be empty")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail()
    .custom(async (value, { req }) => {
      const user = await Users.findOne({ email: value });
      if (user) {
        return Promise.reject("Email already exists");
      }
      return true;
    }),
];

export default {
  ownerLogin,
  changePassword,
  updateOwner,
};
