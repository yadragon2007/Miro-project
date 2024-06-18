import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const currencySchema = new Schema(
  {
    currencyCode: { type: String, required: true },
    symbol: { type: String, required: true },
    thousands_separator: { type: String, required: true },
    decimal_separator: { type: String, required: true },
  },
  { timestamps: true }
);

const Currency = model("Currency", currencySchema);

export default Currency;
