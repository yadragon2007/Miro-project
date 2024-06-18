import axios from "axios";
const apiKey = process.env.EXCHANGE_API_KEY;

const getAllAvilabelCurrencies = async () => {
  try {
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

    const currencies = await axios.get(url);

    return currencies;
  } catch (error) {
    return error;
  }
};

const conversionCurrency = async (base, target, amount) => {
  try {
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${base}/${target}/${amount}`;

    const conversion = await axios.get(url);

    return conversion;
  } catch (error) {
    return error;
  }
};

const supportedCurrencyCodes = async () => {
  try {
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/codes`;

    const currencies = await axios.get(url);

    return currencies;
  } catch (error) {
    return error;
  }
};

export default {
  getAllAvilabelCurrencies,
  conversionCurrency,
  supportedCurrencyCodes,
};
