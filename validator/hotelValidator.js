import { body, header } from "express-validator";
import Hotels from "../models/hotelModel.js";

const phonesArray = ["ar-EG"];

const addHotel = [
  body("name")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("name required")
    .isString()
    .withMessage("name must be string")
    .custom(async (name) => {
      const hotel = await Hotels.findOne({ name });
      if (hotel)
        return Promise.reject(
          new Error("there is an hotel with the same name")
        );
    })
    .withMessage("there is an hotel with the same name"),
  body("stars")
    .notEmpty()
    .withMessage("stars number required")
    .isInt({ min: 0, max: 5 })
    .withMessage("stars must be a number between 0 to 5"),
  body("phone")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("phone required")
    .isNumeric()
    .withMessage("phone must be a number")
    .isMobilePhone(phonesArray)
    .withMessage(`phone number must be [${phonesArray}]`),
  body("description")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("description required")
    .isString()
    .withMessage("description must be string")
    .isLength({ max: 500 })
    .withMessage("max length is 500 letter"),
  body("location")
    .notEmpty()
    .withMessage("location required")
    .isObject()
    .withMessage("location must be object")
    .contains(),
  body("location.long")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 to 180"),
  body("location.lat")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Longitude must be between -90 to 90"),
  body("location.address")
    .notEmpty()
    .withMessage("address is required")
    .isString()
    .withMessage("address must be string"),
];

const getHotel = [
  body("name")
    .optional()
    .isString()
    .withMessage("name must be string")
    .custom(async (name) => {
      const hotel = await Hotels.findOne({ name });
      if (!hotel)
        return Promise.reject(
          new Error("there is no hotel with the this name")
        );
    })
    .withMessage("there is no hotel with the this name"),
  body("id")
    .optional()
    .isString()
    .withMessage("id must be string")
    .custom(async (id) => {
      const hotel = await Hotels.findById(id);
      if (!hotel)
        return Promise.reject(new Error("there is no hotel with the this id"));
    })
    .withMessage("there is no hotel with the this id"),
];

const updateHotel = [
  body("hotelId")
    .notEmpty()
    .withMessage("hotelid must not be empty")
    .isString()
    .withMessage("hotelid must be string")
    .isMongoId()
    .withMessage("hotelId must be mongo id")
    .custom(async (id) => {
      const hotel = await Hotels.findById(id);
      if (!hotel)
        return Promise.reject(new Error("there is no hotel with the this id"));
    })
    .withMessage("there is no hotel with the this id"),

  body("name")
    .optional()
    .isString()
    .withMessage("name must be string")
    .custom(async (name, { req }) => {
      const hotel = await Hotels.findOne({ name });
      if (hotel && hotel._id != req.body.hotelId)
        return Promise.reject(
          new Error("there is an hotel with the same name")
        );
    })
    .withMessage("there is an hotel with the same name"),

  body("stars")
    .optional()
    .isInt({ min: 0, max: 5 })
    .withMessage("stars must be a number between 0 to 5"),

  body("description")
    .optional()
    .isString()
    .withMessage("description must be string")
    .isLength({ max: 500 })
    .withMessage("max length is 500 letter"),
  body("location").optional().isObject().withMessage("location must be object"),

  body("location.long")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 to 180"),

  body("location.lat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Longitude must be between -90 to 90"),

  body("location.address")
    .optional()
    .isString()
    .withMessage("address must be string"),
  body("phone")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("phone required")
    .isNumeric()
    .withMessage("phone must be a number")
    .isMobilePhone(phonesArray),
];

const deleteHotel = [
  header("id")
    .notEmpty()
    .withMessage("hotelid must not be empty")
    .isString()
    .withMessage("hotelid must be string")
    .isMongoId()
    .withMessage("hotelId must be mongo id")
    .custom(async (id) => {
      const hotel = await Hotels.findById(id);
      if (!hotel)
        return Promise.reject(new Error("there is no hotel with the this id"));
    })
    .withMessage("there is no hotel with the this id"),
];

const addImg = [
  header("hotelid")
    .notEmpty()
    .withMessage("hotelid must not be empty")
    .isString()
    .withMessage("hotelid must be string")
    .isMongoId()
    .withMessage("hotelId must be mongo id")
    .custom(async (id) => {
      const hotel = await Hotels.findById(id);
      if (!hotel)
        return Promise.reject(new Error("there is no hotel with the this id"));
    })
    .withMessage("there is no hotel with the this id"),
];

const deleteImg = [
  body("hotelId")
    .notEmpty()
    .withMessage("hotelid must not be empty")
    .isString()
    .withMessage("hotelid must be string")
    .isMongoId()
    .withMessage("hotelId must be mongo id")
    .custom(async (id) => {
      const hotel = await Hotels.findById(id);
      if (!hotel)
        return Promise.reject(new Error("there is no hotel with this id"));
    })
    .withMessage("there is no hotel with the this id"),
  body("deletedImages")
    .notEmpty()
    .withMessage("deletedImages must not be empty")
    .isArray()
    .withMessage("deletedImages must be array"),
  body("deletedImages.*")
    .notEmpty()
    .withMessage("imagesIndexes obiect must not be empty"),
  body("deletedImages.*.imageFolder")
    .notEmpty()
    .withMessage("imageFolder must not be empty")
    .isString()
    .withMessage("imageFolder must be string")
    .custom(async (imageFolder, { req }) => {
      const { hotelId } = req.body;
      const hotel = await Hotels.findById(hotelId);
      if (!hotel.images[imageFolder])
        return Promise.reject(new Error("there is no folder with this name"));
    })
    .withMessage("there is no Folder with this name"),
  body("deletedImages.*.imageName")
    .notEmpty()
    .withMessage("imageName must not be empty")
    .isString()
    .withMessage("imageName must be string")
    .custom(async (imageName, { req }) => {
      const { hotelId } = req.body;
      const hotel = await Hotels.findById(hotelId);
      const folderName = imageName.split("-")[1];
      if (!hotel.images[folderName].includes(imageName))
        return Promise.reject(new Error("there is no image with this name"));
    })
    .withMessage("there is no image with this name"),
];

const updateHotelData = [
  body("hotelId")
    .notEmpty()
    .withMessage("hotelid must not be empty")
    .isString()
    .withMessage("hotelid must be string")
    .isMongoId()
    .withMessage("hotelId must be mongo id")
    .custom(async (id) => {
      const hotel = await Hotels.findById(id);
      if (!hotel)
        return Promise.reject(new Error("there is no hotel with this id"));
    })
    .withMessage("there is no hotel with the this id"),
  // features
  body("freeFeatures")
    .optional()
    .isArray()
    .withMessage("freeFeatures must be array"),
  body("freeFeatures.*")
    .notEmpty()
    .withMessage("freeFeatures must not be empty")
    .isObject()
    .withMessage("freeFeatures must be object"),
  body("freeFeatures.*.name")
    .notEmpty()
    .withMessage("freeFeatures name must not be empty")
    .isString()
    .withMessage("freeFeatures name must be string")
    .custom(async (name, { req }) => {
      const hotel = await Hotels.findById(req.body.hotelId);
      const feature = hotel.freeFeatures.find(
        (feature) => feature.name === name
      );
      if (feature)
        return Promise.reject(new Error("there is a feature with this name"));
    }),
  body("freeFeatures.*.discription")
    .optional()
    .notEmpty()
    .withMessage("freeFeatures discription must not be empty")
    .isString()
    .withMessage("freeFeatures discription must be string")
    .isLength({ max: 30 })
    .withMessage("freeFeatures discription must be less than 30 characters"),
  // meals
  body("meals").optional().isArray().withMessage("meals must be array"),
  body("meals.*")
    .notEmpty()
    .withMessage("meal must not be empty")
    .isObject()
    .withMessage("meal must be object"),
  body("meals.*.name")
    .isString()
    .withMessage("meals name must be string")
    .custom(async (name, { req }) => {
      const hotel = await Hotels.findById(req.body.hotelId);
      const meal = hotel.meals.find((meal) => meal.name === name);
      if (meal)
        return Promise.reject(new Error("there is a meal with this name"));
    }),
  body("meals.*.description")
    .optional()
    .isString()
    .withMessage("meals description must be string")
    .isLength({ max: 500 })
    .withMessage("meals description must be less than 500 characters"),
  body("meals.*.time").isObject().withMessage("time must be object"),
  body("meals.*.time.form.hour")
    .notEmpty()
    .isInt({ min: 1, max: 12 })
    .withMessage("time must be between 1 to 12"),
  body("meals.*.time.form.minute")
    .isInt({ min: 0, max: 59 })
    .withMessage("time must be between 0 to 60"),
  body("meals.*.time.form.AmPm")
    .isString()
    .isIn(["Am", "Pm"])
    .withMessage('AmPm must be either "Am" or "Pm"'),
  body("meals.*.time.to.hour")
    .isInt({ min: 1, max: 12 })
    .withMessage("time must be between 1 to 12"),
  body("meals.*.time.to.minute")
    .isInt({ min: 0, max: 59 })
    .withMessage("time must be between 0 to 60"),
  body("meals.*.time.to.AmPm").isString(),
  body("meals.*.pricePerDay.price")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("pricePerDay must be string")
    .isInt()
    .withMessage("pricePerDay must be int"),
  // rooms
  body("rooms").optional().isArray().withMessage("rooms must be array"),
  body("rooms.*")
    .notEmpty()
    .withMessage("room must not be empty")
    .isObject()
    .withMessage("rooms must be object"),
  body("rooms.*.name")
    .notEmpty()
    .withMessage("room name must not be empty")
    .isString()
    .withMessage("room name must be string")
    .custom(async (name, { req }) => {
      const hotel = await Hotels.findById(req.body.hotelId);
      const room = hotel.rooms.find((room) => room.name === name);
      if (room)
        return Promise.reject(new Error("there is a room with this name"));
    }),
  body("rooms.*.beds")
    .notEmpty()
    .withMessage("beds must not be empty")
    .isInt({ min: 1 })
    .withMessage("beds must be int"),
  body("rooms.*.description")
    .optional()
    .isString()
    .withMessage("description must be string")
    .isLength({ max: 500 })
    .withMessage("description must be less than 500 characters"),
  body("rooms.*.amenities").isArray().withMessage("amenities must be array"),
  body("rooms.*.amenities.*")
    .isString()
    .withMessage("amenities indexes must be string"),
  body("rooms.*.pricePerNight.price")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("pricePerDay must be string")
    .isInt()
    .withMessage("pricePerDay must be int"),
  body("rooms.*.numberOfRooms")
    .notEmpty()
    .withMessage("numberOfRooms must not be empty")
    .isInt({ min: 1 })
    .withMessage("numberOfRooms of rooms must be int"),
];

const deleteHotelData = [
  body("hotelId")
    .notEmpty()
    .withMessage("hotelId must not be empty")
    .isString()
    .withMessage("hotelId must be string")
    .isMongoId()
    .withMessage("hotelId must be mongo id")
    .custom(async (id) => {
      const hotel = await Hotels.findById(id);
      if (!hotel)
        return Promise.reject(new Error("there is a room with this id"));
    }),
  body("freeFeatures")
    .optional()
    .isArray()
    .withMessage("freeFeatures must be array"),
  body("freeFeatures.*")
    .notEmpty()
    .withMessage("freeFeatures must not be empty")
    .isString()
    .withMessage("freeFeatures indexes must be string")
    .custom(async (name, { req }) => {
      const hotel = await Hotels.findById(req.body.hotelId);
      const feature = hotel.freeFeatures.find((f) => f.name === name);
      if (!feature)
        return Promise.reject(new Error("there is no feature with this name"));
    }),
  body("meals").optional().isArray().withMessage("meals must be array"),
  body("meals.*")
    .notEmpty()
    .withMessage("meals must not be empty")
    .isString()
    .withMessage("meals indexes must be string")
    .custom(async (name, { req }) => {
      const hotel = await Hotels.findById(req.body.hotelId);
      const meal = hotel.meals.find((m) => m.name === name);
      if (!meal)
        return Promise.reject(new Error("there is no meal with this name"));
    }),
  body("rooms").optional().isArray().withMessage("rooms must be array"),
  body("rooms.*")
    .notEmpty()
    .withMessage("rooms must not be empty")
    .isString()
    .withMessage("rooms indexes must be string")
    .custom(async (name, { req }) => {
      const hotel = await Hotels.findById(req.body.hotelId);
      const room = hotel.rooms.find((r) => r.name === name);
      if (!room)
        return Promise.reject(new Error("there is no room with this name"));
    }),
];

const modifyHotelData = [
  body("hotelId")
    .notEmpty()
    .withMessage("hotelId must not be empty")
    .isString()
    .withMessage("hotelId must be string")
    .isMongoId()
    .withMessage("hotelId must be mongo id")
    .custom(async (id) => {
      const hotel = await Hotels.findById(id);
      if (!hotel)
        return Promise.reject(new Error("there is a room with this id"));
    }),
  body("freeFeatures")
    .optional()
    .isArray()
    .withMessage("freeFeatures must be array"),
  body("freeFeatures.*")
    .optional()
    .notEmpty()
    .withMessage("freeFeatures must not be empty")
    .isObject()
    .withMessage("freeFeatures indexes must be object"),
  body("freeFeatures.*.name")
    .notEmpty()
    .withMessage("freeFeatures.name must not be empty")
    .isString()
    .withMessage("freeFeatures.name must be string")
    .custom(async (name, { req }) => {
      const hotel = await Hotels.findById(req.body.hotelId);
      const feature = hotel.freeFeatures.find((f) => f.name === name);
      if (!feature)
        return Promise.reject(new Error("there is no feature with this name"));
    }),
  body("freeFeatures.*.newData")
    .notEmpty()
    .withMessage("newData must not be empty")
    .isObject()
    .withMessage("newData must be object"),
  body("freeFeatures.*.newData.name")
    .optional()
    .notEmpty()
    .withMessage("newData.name must not be empty")
    .isString()
    .withMessage("newData.name must be string")
    .custom(async (name, { req }) => {
      const hotel = await Hotels.findById(req.body.hotelId);
      const feature = hotel.freeFeatures.find((f) => f.name === name);
      if (feature)
        return Promise.reject(new Error("there is a feature with this name"));
    }),
  body("freeFeatures.*.newData.description")
    .optional()
    .notEmpty()
    .withMessage("newData.description must not be empty")
    .isString()
    .withMessage("newData.description must be string")
    .isLength({ max: 30 })
    .withMessage("newData.description must be less than 30 characters"),
  // meals
  body("meals").optional().isArray().withMessage("meals must be array"),
  body("meals.*")
    .optional()
    .notEmpty()
    .withMessage("meal must not be empty")
    .isObject()
    .withMessage("meal must be object"),
  body("meals.*.name")
    .isString()
    .withMessage("meals name must be string")
    .custom(async (name, { req }) => {
      const hotel = await Hotels.findById(req.body.hotelId);
      const meal = hotel.meals.find((meal) => meal.name === name);
      if (!meal)
        return Promise.reject(new Error("there is no meal with this name"));
    }),
  body("meals.*.newData")
    .notEmpty()
    .withMessage("newData must not be empty")
    .isObject()
    .withMessage("newData must be object"),
  body("meals.*.newData.name")
    .optional()
    .notEmpty()
    .withMessage("newData.name must not be empty")
    .isString()
    .withMessage("newData.name must be string")
    .custom(async (name, { req }) => {
      const hotel = await Hotels.findById(req.body.hotelId);
      const meal = hotel.meals.find((meal) => meal.name === name);
      if (!meal)
        return Promise.reject(new Error("there is no meal with this name"));
    }),
  body("meals.*.newData.description")
    .optional()
    .isString()
    .withMessage("meals description must be string")
    .isLength({ max: 500 })
    .withMessage("meals description must be less than 500 characters"),
  body("meals.*.newData.time")
    .optional()
    .isObject()
    .withMessage("time must be object"),
  body("meals.*.newData.time.form")
    .isObject()
    .withMessage("form must be object")
    .notEmpty()
    .withMessage("form must not be empty"),
  body("meals.*.newData.time.form.hour")
    .notEmpty()
    .isInt({ min: 1, max: 12 })
    .withMessage("time must be between 1 to 12"),
  body("meals.*.newData.time.form.minute")
    .isInt({ min: 0, max: 59 })
    .withMessage("time must be between 0 to 60"),
  body("meals.*.newData.time.form.AmPm")
    .isString()
    .isIn(["Am", "Pm"])
    .withMessage('AmPm must be either "Am" or "Pm"'),
  body("meals.*.newData.time.to")
    .isObject()
    .withMessage("to must be object")
    .notEmpty()
    .withMessage("to must not be empty"),
  body("meals.*.newData.time.to.hour")
    .isInt({ min: 1, max: 12 })
    .withMessage("time must be between 1 to 12"),
  body("meals.*.newData.time.to.minute")
    .isInt({ min: 0, max: 59 })
    .withMessage("time must be between 0 to 60"),
  body("meals.*.newData.time.to.AmPm").isString(),
  body("meals.*.newData.pricePerDay.price")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("pricePerDay must be string")
    .isInt()
    .withMessage("pricePerDay must be int"),
  body("rooms")
    .optional()
    .notEmpty()
    .withMessage("rooms must not be empty")
    .isArray()
    .withMessage("rooms must be array"),
  body("rooms.*")
    .isObject()
    .withMessage("rooms must be object")
    .notEmpty()
    .withMessage("rooms must not be empty"),
  body("rooms.*.name")
    .notEmpty()
    .withMessage("name must not be empty")
    .isString()
    .withMessage("name must be string")
    .custom(async (name, { req }) => {
      const hotel = await Hotels.findById(req.body.hotelId);
      const room = hotel.rooms.find((room) => room.name === name);
      if (!room)
        return Promise.reject(new Error("there is no room with this name"));
    })
    .custom(async (name, { req }) => {
      const hotel = await Hotels.findById(req.body.hotelId);
      const room = hotel.rooms.find((room) => room.name === name);

      for (let i = 0; i < req.body.rooms.length; i++) {
        if (req.body.rooms[i].newData.numberOfRooms) {
          if (req.body.rooms[i].newData.numberOfRooms >= room.numberOfRooms) {
            const newEmptyRooms =
              room.emptyRooms +
              (req.body.rooms[i].newData.numberOfRooms - room.numberOfRooms);
            req.body.rooms[i].newData.emptyRooms = newEmptyRooms;
            return;
          } else if (
            req.body.rooms[i].newData.numberOfRooms < room.numberOfRooms
          ) {
            if (req.body.rooms[i].newData.numberOfRooms >= room.bookedRooms) {
              const newEmptyRooms =
                req.body.rooms[i].newData.numberOfRooms - room.bookedRooms;
              req.body.rooms[i].newData.emptyRooms = newEmptyRooms;
              return;
            } else {
              return Promise.reject(
                new Error("number of rooms is less than booked rooms")
              );
            }
          }
        } else continue;
      }

      return;
    }),
  body("rooms.*.newData.beds").isEmpty().withMessage("beds unable to modify"),
  body("rooms.*.newData.description")
    .optional()
    .isString()
    .withMessage("description must be string")
    .isLength({ max: 500 })
    .withMessage("description must be less than 500 characters"),
  body("rooms.*.newData.amenities")
    .optional()
    .isArray()
    .withMessage("amenities must be array"),
  body("rooms.*.newData.amenities.*")
    .isString()
    .withMessage("amenities indexes must be string"),
  body("rooms.*.newData.pricePerNight.price")
    .optional()
    .notEmpty()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("pricePerDay must be string")
    .isInt()
    .withMessage("pricePerDay must be int"),
  body("rooms.*.newData.numberOfRooms")
    .optional()
    .notEmpty()
    .withMessage("numberOfRooms must not be empty")
    .isInt({ min: 1 })
    .withMessage("numberOfRooms of rooms must be int"),
  body("rooms.*.newData.emptyRooms")
    .isEmpty()
    .withMessage("emptyRooms must be empty"),
  body("rooms.*.newData.bookedRooms")
    .isEmpty()
    .withMessage("bookedRooms must be empty"),
];

export default {
  addHotel,
  getHotel,
  updateHotel,
  deleteHotel,
  addImg,
  deleteImg,
  updateHotelData,
  deleteHotelData,
  modifyHotelData,
};
