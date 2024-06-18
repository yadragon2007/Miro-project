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
export default {
  ownerLogin,
};
