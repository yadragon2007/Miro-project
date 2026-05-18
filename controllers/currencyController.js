import Currency from "../models/currencyModel.js";
import currencyService from "../services/currencyService.js";

// @route   POST api/currency/
// @desc    add currency
// @access  Private
const addCurrency_post = async (req, res) => {
  try {
    const {
      currencyCode,
      symbol,
      thousands_separator,
      decimal_separator,
    } = req.body;
    const data = { currencyCode, symbol, thousands_separator, decimal_separator };
    const newCurrency = new Currency(data);
    const currency = await newCurrency.save();
    return res
      .status(201)
      .send({ msg: `currency added succefully`, data: currency });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: `Internal Server Error` });
  }
};

// @route   POST api/currency/get/
// @desc    add currency
// @access  Private
const getSpecificCurrency_post = async (req, res) => {
  try {
    const data = {};
    if (req.body.currencyCode) data.currencyCode = req.body.currencyCode;
    if (req.body._id) data._id = req.body._id;

    const currency = await Currency.findOne(data);

    return res.status(200).send({ data: currency });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: `Internal Server Error` });
  }
};

// @route   GET api/currency/
// @desc    get all currencies
// @access  Private
const getAllCurrencies_get = async (req, res) => {
  try {
    const filter = {};
    for (const key of ["currencyCode", "symbol"]) {
      if (req.query[key] !== undefined) filter[key] = req.query[key];
    }
    const allCurrencies = await Currency.find(filter);

    return res.status(200).send({ data: allCurrencies });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: `Internal Server Error` });
  }
};

// @route   PUT api/currency/
// @desc    update currency data
// @access  Private
const updateAllCurrencies_put = async (req, res) => {
  try {
    const { currencyId: id, currencyCode, symbol, thousands_separator, decimal_separator } = req.body;
    const data = {};
    if (currencyCode !== undefined) data.currencyCode = currencyCode;
    if (symbol !== undefined) data.symbol = symbol;
    if (thousands_separator !== undefined) data.thousands_separator = thousands_separator;
    if (decimal_separator !== undefined) data.decimal_separator = decimal_separator;

    await Currency.findByIdAndUpdate(id, data);
    const newCurrency = await Currency.findById(id);

    return res.status(200).send({ data: newCurrency });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: `Internal Server Error` });
  }
};

// @route   DELETE api/currency/
// @desc    delete currency
// @access  Private
const deleteCurrency_delete = async (req, res) => {
  try {
    const { currencyId: id } = req.body;

    await Currency.findByIdAndDelete(id);

    return res.status(200).send({ msg: "currency deleted succefully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: `Internal Server Error` });
  }
};

// @route   GET api/currency/api/getAllCurrenciesCodes
// @desc    get all currencies code
// @access  Private
const getAllCurrenciesCode_get = async (req, res) => {
  try {
    const supportedCurrencyCodes =
      await currencyService.supportedCurrencyCodes();

    return res
      .status(200)
      .send({ supportedCodes: supportedCurrencyCodes.data });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: `Internal Server Error` });
  }
};

// @route   GET api/currency/api/conversionCurrency/:base/:target/:amount
// @desc    get all currencies code
// @access  Private
const conversionCurrency_get = async (req, res) => {
  try {
    const { base, target, amount } = req.params;
    const conversionCurrency = await currencyService.conversionCurrency(
      base,
      target,
      amount
    );
    return res
      .status(200)
      .send({ conversionCurrency: conversionCurrency.data });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: `Internal Server Error` });
  }
};

export default {
  addCurrency_post,
  getSpecificCurrency_post,
  getAllCurrencies_get,
  updateAllCurrencies_put,
  deleteCurrency_delete,
  getAllCurrenciesCode_get,
  conversionCurrency_get,
};
