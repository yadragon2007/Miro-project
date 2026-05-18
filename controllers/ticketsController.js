import Accounts from "../models/accountsModel.js";
import Hotels from "../models/hotelModel.js";
import PromoCode from "../models/promoCodeModel.js";
import asyncHandler from "../utils/asyncHandler.js";

const bookTicket_post = asyncHandler(async (req, res) => {
  const {
    hotelId,
    promoCode: code,
    roomName,
    checkInDate,
    checkOutDate,
    adults,
    children,
    meals,
  } = req.body;
  const userId = req.auth.userId;

  const user = await Accounts.findById(userId);
  const hotel = await Hotels.findById(hotelId);
  const promoCode = await PromoCode.findOne({ code });
  const checkIn = new Date(
    checkInDate.year,
    checkInDate.month - 1,
    checkInDate.day
  );
  const checkOut = new Date(
    checkOutDate.year,
    checkOutDate.month - 1,
    checkOutDate.day
  );
  const daysInHotel = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  let mealsData = [];
  for (let i = 0; i < hotel.meals.length; i++) {
    for (let z = 0; z < meals.length; z++) {
      if (meals[z] == hotel.meals[i].name) {
        mealsData.push(hotel.meals[i]);
      }
    }
  }

  console.log(mealsData);
});

export default {
  bookTicket_post,
};
