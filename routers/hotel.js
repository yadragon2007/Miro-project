import { Router } from "express";
const router = Router();

import hotelController from "../controllers/hotelController.js";
import authorization from "../middleware/authorization.js";
import hotelValidator from "../validator/hotelValidator.js";
import hotelFilesHundler from "../services/hotelFilesHundler.js";
import localValidationFunction from "../validator/localValidationFunction.js";

// @route   POST api/hotel/
// @desc    Add hotel
// @access  Private
const addHotelProperties = [
  "name",
  "description",
  "stars",
  "phone",
  "currency",
  "location",
];
router.post(
  "/",
  authorization.AdminAuthorization,
  localValidationFunction.validateBodyProperties(addHotelProperties),
  hotelValidator.addHotel,
  localValidationFunction.errorHandler,
  hotelFilesHundler.addHotelFolder,
  hotelController.addHotel_post
);

// @route   GET api/hotel/
// @desc    Get all hotels
// @access  Private
router.get(
  "/",
  authorization.AdminAuthorization,
  hotelController.getAllHotels_get
);

// @route   POST api/hotel/get
// @desc    Get specific hotel
// @access  Private
const getSpecificHotelProperties = ["id","name"]
router.post(
  "/get",
  authorization.AdminAuthorization,
  localValidationFunction.validateBodyProperties(getSpecificHotelProperties),
  hotelValidator.getHotel,
  localValidationFunction.errorHandler,
  hotelController.getSpecificHotel_post
);

// @route   PUT api/hotel/
// @desc    update hotel [ "name" , "description" , "stars" , "location" ,"phone"]
// @access  Private
const validBodyPropertiesInformationData = [
  "hotelId",
  "name",
  "description",
  "stars",
  "location",
  "phone",
];
router.put(
  "/",
  authorization.AdminAuthorization,
  localValidationFunction.validateBodyProperties(
    validBodyPropertiesInformationData
  ),
  hotelValidator.updateHotel,
  localValidationFunction.errorHandler,
  hotelController.updateHotel_put
);

// @route   DELETE api/hotel/
// @desc    Delete hotel
// @access  Private
router.delete(
  "/",
  authorization.AdminAuthorization,
  hotelValidator.deleteHotel,
  localValidationFunction.errorHandler,
  hotelFilesHundler.deleteHotelFolder,
  hotelController.deleteHotel_delete
);

// handle images` name and count
const images = hotelFilesHundler.upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
]);

// @route   PATCH api/hotel/images
// @desc    Add hotel images
// @access  Private
router.patch(
  "/images",
  authorization.AdminAuthorization,
  hotelValidator.addImg,
  localValidationFunction.errorHandler,
  images,
  hotelController.addImages_patch
);

// @route   DELETE api/hotel/images
// @desc    delete hotel images
// @access  Private

router.delete(
  "/images",
  authorization.AdminAuthorization,
  hotelValidator.deleteImg,
  localValidationFunction.errorHandler,
  hotelFilesHundler.deleteHotelImages,
  hotelController.deleteImages_delete
);

// @route   patch api/hotel/data
// @desc    add hotel data ["hotelId","freeFeatures","meals","rooms"]
// @access  Private

const validBodyPropertiesHotelData = [
  "hotelId",
  "freeFeatures",
  "meals",
  "rooms",
];
router.patch(
  "/data",
  authorization.AdminAuthorization,
  localValidationFunction.validateBodyProperties(validBodyPropertiesHotelData),
  hotelValidator.updateHotelData,
  localValidationFunction.errorHandler,
  hotelController.hotelUpdate_patch
);

// @route   DELETE api/hotel/room
// @desc    delete hotel room
// @access  Private

router.delete(
  "/data",
  authorization.AdminAuthorization,
  localValidationFunction.validateBodyProperties(validBodyPropertiesHotelData),
  hotelValidator.deleteHotelData,
  localValidationFunction.errorHandler,
  hotelController.deleteHotelData_delete
);

// @route   patch api/hotel/modify
// @desc    modify hotel data ["hotelId","freeFeatures","meals","rooms"]
// @access  Private

router.patch(
  "/modify",
  authorization.AdminAuthorization,
  localValidationFunction.validateBodyProperties(validBodyPropertiesHotelData),
  hotelValidator.modifyHotelData,
  localValidationFunction.errorHandler,
  hotelController.modifyHotelData_patch
);

export default router;
