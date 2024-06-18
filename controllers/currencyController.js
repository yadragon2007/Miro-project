import Currency from "../models/currencyModel.js";
import currencyService from "../services/currencyService.js";

// @route   POST api/currency/
// @desc    add currency
// @access  Private
const addCurrency_post = async (req, res) => {
  try {
    const data = req.body;
    const newCurrency = new Currency(data);
    const currency = await newCurrency.save();
    return res
      .status(201)
      .send({ msg: `currency added succefully`, data: currency });
  } catch (error) {
    return res.status(500).send({ msg: `Internal Server Error`, error });
  }
};

// @route   POST api/currency/get/
// @desc    add currency
// @access  Private
const getSpecificCurrency_post = async (req, res) => {
  try {
    const data = req.body;

    const currency = await Currency.findOne(data);

    return res.status(200).send({ data: currency });
  } catch (error) {
    return res.status(500).send({ msg: `Internal Server Error`, error });
  }
};

// @route   GET api/currency/
// @desc    get all currencies
// @access  Private
const getAllCurrencies_get = async (req, res) => {
  try {
    const filter = req.query;
    const allCurrencies = await Currency.find(filter);

    return res.status(200).send({ data: allCurrencies });
  } catch (error) {
    return res.status(500).send({ msg: `Internal Server Error`, error });
  }
};

// @route   PUT api/currency/
// @desc    update currency data
// @access  Private
const updateAllCurrencies_put = async (req, res) => {
  try {
    const { currencyId: id } = req.body;
    let data = req.body;
    delete data.currencyId;

    await Currency.findByIdAndUpdate(id, data);
    const newCurrency = await Currency.findById(id);

    return res.status(200).send({ data: newCurrency });
  } catch (error) {
    return res.status(500).send({ msg: `Internal Server Error`, error });
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
    return res.status(500).send({ msg: `Internal Server Error`, error });
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
    return res.status(500).send({ msg: `Internal Server Error`, error });
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
    return res.status(500).send({ msg: `Internal Server Error`, error });
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
