import Accounts from "../models/accountsModel.js";
import Hotels from "../models/hotelModel.js";
import PromoCode from "../models/promoCodeModel.js";

const bookTicket_post = async (req, res) => {
  try {
    const {
      hotelId,
      promoCode: code,
      userId,
      roomName,
      checkInDate,
      checkOutDate,
      adults,
      children,
      meals,
    } = req.body;

    const user = await Accounts.findById(userId);
    const hotel = await Hotels.findById(hotelId);
    const promoCode = await PromoCode.findOne({ code });
    // check in date data
    const checkIn = new Date(
      checkInDate.year,
      checkInDate.month,
      checkInDate.day
    );
    // check out date data
    const checkOut = new Date(
      checkOutDate.year,
      checkOutDate.month,
      checkOutDate.day
    );
    // days that user will spend in hotel
    const daysInHotel = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    // get meals
    let mealsData = [];
    for (let i = 0; i < hotel.meals.length; i++) {
      for (let z = 0; z < meals.length; z++) {
        if (meals[z] == hotel.meals[i].name) {
          mealsData.push(hotel.meals[i]);
        }
      }
    }
    // get room
    
    console.log(mealsData);
  } catch (error) {
    return res.status(500).send({ msg: `Internal Server Error`, error });
  }
};

export default {
  bookTicket_post,
};
