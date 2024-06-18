import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const hotelsSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  stars: { type: Number, min: 0, max: 7 },
  images: { type: Object, default: {} },
  phone: { type: String, required: true },
  currency: String,
  location: {
    long: { type: String, required: true },
    lat: { type: String, required: true },
    address: { type: String, required: true },
  },
  freeFeatures: { type: Array, default: [] },
  meals: [
    {
      name: String,
      time: {
        form: {
          hour: { type: Number, min: 1, max: 12 },
          minute: { type: Number, min: 0, max: 60 },
          AmPm: String,
        },
        to: {
          hour: { type: Number, min: 1, max: 12 },
          minute: { type: Number, min: 0, max: 60 },
          AmPm: String,
        },
      },

      pricePerDay: String,
    },
  ],
  rooms: [
    {
      name: String,
      beds: Number,
      description: String,
      amenities: Array,
      pricePerDay: String,
      numberOfRooms: Number,
      emptyRooms: Number,
      bookedRooms: { type: Number, default: 0 },
    },
  ],
  comments: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      text: String,
      rating: { type: Number, min: 1, max: 5 },
    },
  ],
  history: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "Accounts" },
      date: { type: Date, default: Date.now() },
      msg: String,
    },
  ],
});

const Hotels = model("Hotels", hotelsSchema);

export default Hotels;
