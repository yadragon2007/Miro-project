import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const promoCodeSchema = new Schema(
  {
    code: {
      type: String,
      unique: [true, "this code is in use"],
      required: [true, "code is required"],
    },
    expirationDate: {
      type: Date,
      required: [true, "expirationDate is required"],
    },
    forAllHotels: {
      type: Boolean,
      required: [true, "forAllHotels is required"],
    },
    Hotels: [{ type: Schema.Types.ObjectId, ref: "Hotels" }],
    forAllUsers: { type: Boolean, required: [true, "forAllUsers is required"] },
    users: [{ type: Schema.Types.ObjectId, ref: "Accounts" }],
    usedOneTimeOfUser: {
      type: Boolean,
      required: [true, "usedOneTime is required"],
    },
    userWhoUsed: [{ type: Schema.Types.ObjectId, ref: "Accounts" }],

    offer: {
      valueType: {
        type: String,
        enum: ["precentageValue", "amount"],
        required: true,
      },
      value: { type: Number, required: true },
    },
    infintyTimesToUse: {
      type: Boolean,
      required: [true, "infintyTimesToUse is required"],
    },
    howManyToUse: { type: Number },
  },
  { timestamps: true }
);

const PromoCode = model("PromoCode", promoCodeSchema);

export default PromoCode;
