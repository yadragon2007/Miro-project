import { body, validationResult } from "express-validator";
import Role from "../models/roleModel.js";
import Accounts from "../models/accountsModel.js";
import Hotels from "../models/hotelModel.js";
import PromoCode from "../models/promoCodeModel.js";

const bookTicket = [
  body("hotelId")
    .notEmpty()
    .withMessage("hotelId is required")
    .isString()
    .withMessage("hotelId must be a string")
    .isMongoId()
    .withMessage("hotelId must be a valid mongo id")
    .custom(async (id) => {
      const hotel = await Hotels.findById(id);
      if (!hotel) return Promise.reject(new Error("this hotel is not exist"));
      else return;
    }),
  body("roomName")
    .notEmpty()
    .withMessage("roomName is required")
    .isString()
    .withMessage("roomName must be a string")
    .custom(async (roomName, { req }) => {
      const hotel = await Hotels.findById(req.body.hotelId);
      const check = hotel.rooms.find((room) => roomName == room.name);
      if (!check)
        return Promise.reject(new Error("this room name is not exist"));
      else return;
    }),
  body("promoCode")
    .optional()
    .isString()
    .withMessage("promoCode must be a string")
    .custom(async (code, { req }) => {
      const promoCode = await PromoCode.findOne({ code });
      const { hotelId } = req.body;
      const userId = req.auth.userId;
      // check if promoCode is exist
      if (!promoCode)
        return Promise.reject(new Error("this code is not exist"));
      // check if promoCode is not expired
      const date = new Date();
      if (promoCode.expirationDate.getTime() < date.getTime())
        return Promise.reject(new Error("this promoCode is expired"));
      // check if hotel can access this promoCode
      if (promoCode.forAllHotels === false) {
        const hotel = promoCode.Hotels.find((id) => id == hotelId);
        if (!hotel)
          return Promise.reject(
            new Error(`this promoCode is unavilable to this hotle ${hotelId}`)
          );
      }
      //check if itis first time to use this promo code
      if (promoCode.usedOneTimeOfUser == true) {
        const user = promoCode.userWhoUsed.find((id) => id == userId);
        if (user)
          return Promise.reject(new Error(`you already used this promoCode`));
      }
      // check promoCode limt
      if (promoCode.infintyTimesToUse === false) {
        if (promoCode.howManyToUse <= 0)
          return Promise.reject(
            new Error(`this promoCode unavilable at this time`)
          );
      }
      // check if user has the permission to use this PromoCode
      if (promoCode.forAllUsers == false) {
        const user = promoCode.users.find((id) => id == userId);
        if (!user)
          return Promise.reject(
            new Error(
              `user dose not have the permission to user this promoCode`
            )
          );
      }
    }),
  body("checkInDate")
    .notEmpty()
    .withMessage("checkInDate is required")
    .isObject()
    .withMessage("checkInDate must be an object"),
  body("checkInDate.*")
    .notEmpty()
    .withMessage("checkInDate properties is required")
    .isString()
    .withMessage("checkInDate properties must be a string"),
  body("checkOutDate")
    .notEmpty()
    .withMessage("checkOutDate is required")
    .isObject()
    .withMessage("checkOutDate must be an object"),
  body("checkOutDate.*")
    .notEmpty()
    .withMessage("checkOutDate properties is required")
    .isString()
    .withMessage("checkOutDate properties must be a string"),
  body("adults")
    .notEmpty()
    .withMessage("adults is required")
    .isInt({ min: 0 })
    .withMessage("adults must be an integer"),
  body("children")
    .notEmpty()
    .withMessage("children is required")
    .isInt({ min: 0 })
    .withMessage("children must be an integer"),
  body("meals")
    .notEmpty()
    .withMessage("meals is required")
    .isArray()
    .withMessage("meals must be an array"),
  body("meals.*")
    .notEmpty()
    .withMessage("meals indexes is required")
    .isString()
    .withMessage("meals indexes must be a string")
    .custom(async (mealName, { req }) => {
      const hotle = await Hotels.findById(req.body.hotelId);
      const meal = hotle.meals.find((meal) => meal.name == mealName);
      if (!meal) return Promise.reject(new Error("this meal is not exist"));
    }),
  body("moreDetails")
    .optional()
    .isString()
    .withMessage("moreDetails must be a string")
    .isLength({ max: 500 })
    .withMessage("moreDetails must be less than 500 characters"),
];

const dateCheck = (req, res, next) => {
  const date = new Date();
  // check In Date
  const checkInDate = new Date();
  const {
    year: checkInYear,
    month: checkInMonth,
    day: checkInDay,
  } = req.body.checkInDate;
  checkInDate.setFullYear(checkInYear, checkInMonth - 1, checkInDay);
  // check Out Date
  const checkOutDate = new Date();
  const {
    year: checkOutYear,
    month: checkOutMonth,
    day: checkOutDay,
  } = req.body.checkOutDate;
  checkOutDate.setFullYear(checkOutYear, checkOutMonth - 1, checkOutDay);
  // check if check In Date is after current date
  if (date.getTime() > checkInDate.getTime()) {
    res.status(422).send({
      msg: `check in date must be after ${date.toLocaleDateString()}`,
    });
  } else {
    // check if check out date after check in date
    if (checkInDate.getTime() >= checkOutDate.getTime()) {
      res.status(422).send({
        msg: `check out date must be after ${checkInDate.toLocaleDateString()}`,
      });
    } else {
      next();
    }
  }
};

export default { bookTicket, dateCheck };
