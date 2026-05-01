import { Router } from "express";
const router = Router();

import authorization from "../middleware/authorization.js";
import localValidationFunction from "../validator/localValidationFunction.js";
import ticketsValidator from "../validator/ticketsValidator.js";
import ticketsController from "../controllers/ticketsController.js";

// @route   POST api/role/
// @desc    Add role
// @access  Private
const bookTicketProperties = [
  "hotelId",
  "roomName",
  "promoCode",
  "checkInDate",
  "checkOutDate",
  "adults",
  "children",
  "meals",
  "moreDetails",
];
router.post(
  "/",
  authorization.UserAuthorization,
  localValidationFunction.validateBodyProperties(bookTicketProperties),
  ticketsValidator.bookTicket,
  localValidationFunction.errorHandler,
  ticketsValidator.dateCheck,
  ticketsController.bookTicket_post,
);

export default router;
