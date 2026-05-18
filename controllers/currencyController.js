import Currency from "../models/currencyModel.js";
import currencyService from "../services/currencyService.js";
import asyncHandler from "../utils/asyncHandler.js";

const addCurrency_post = asyncHandler(async (req, res) => {
  const { currencyCode, symbol, thousands_separator, decimal_separator } =
    req.body;
  const data = { currencyCode, symbol, thousands_separator, decimal_separator };
  const newCurrency = new Currency(data);
  const currency = await newCurrency.save();
  return res
    .status(201)
    .send({ msg: `currency added succefully`, data: currency });
});

const getSpecificCurrency_post = asyncHandler(async (req, res) => {
  const data = {};
  if (req.body.currencyCode) data.currencyCode = req.body.currencyCode;
  if (req.body._id) data._id = req.body._id;
  const currency = await Currency.findOne(data);
  return res.status(200).send({ data: currency });
});

const getAllCurrencies_get = asyncHandler(async (req, res) => {
  const filter = {};
  for (const key of ["currencyCode", "symbol"]) {
    if (req.query[key] !== undefined) filter[key] = req.query[key];
  }
  const allCurrencies = await Currency.find(filter);
  return res.status(200).send({ data: allCurrencies });
});

const updateAllCurrencies_put = asyncHandler(async (req, res) => {
  const {
    currencyId: id,
    currencyCode,
    symbol,
    thousands_separator,
    decimal_separator,
  } = req.body;
  const data = {};
  if (currencyCode !== undefined) data.currencyCode = currencyCode;
  if (symbol !== undefined) data.symbol = symbol;
  if (thousands_separator !== undefined)
    data.thousands_separator = thousands_separator;
  if (decimal_separator !== undefined)
    data.decimal_separator = decimal_separator;
  await Currency.findByIdAndUpdate(id, data);
  const newCurrency = await Currency.findById(id);
  return res.status(200).send({ data: newCurrency });
});

const deleteCurrency_delete = asyncHandler(async (req, res) => {
  const { currencyId: id } = req.body;
  await Currency.findByIdAndDelete(id);
  return res.status(200).send({ msg: "currency deleted succefully" });
});

const getAllCurrenciesCode_get = asyncHandler(async (req, res) => {
  const supportedCurrencyCodes = await currencyService.supportedCurrencyCodes();
  return res
    .status(200)
    .send({ supportedCodes: supportedCurrencyCodes.data });
});

const conversionCurrency_get = asyncHandler(async (req, res) => {
  const { base, target, amount } = req.params;
  const conversionCurrency = await currencyService.conversionCurrency(
    base,
    target,
    amount
  );
  return res
    .status(200)
    .send({ conversionCurrency: conversionCurrency.data });
});

export default {
  addCurrency_post,
  getSpecificCurrency_post,
  getAllCurrencies_get,
  updateAllCurrencies_put,
  deleteCurrency_delete,
  getAllCurrenciesCode_get,
  conversionCurrency_get,
};
