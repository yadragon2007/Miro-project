import dotenv from "dotenv";
dotenv.config();

export default {
  Email: {
    email: process.env.Email,
    password: process.env.PASSWORD,
  },
  JWT: {
    secret: process.env.JWT_SECRET_KEY,
    expire: process.env.JWT_EXPIRE,
  },
  Activation: {
    secret: process.env.ACTIVATION_SECRET,
    expire: process.env.ACTIVATION_EXPIRE,
  },
  ExchangeRate_API: {
    apiKey: process.env.EXCHANGE_API_KEY,
  },
  port: process.env.PORT,
  Owner: {
    email: process.env.OWNER_ACCOUNT_EMAIL,
    password: process.env.OWNER_ACCOUNT_PASSWORD,
  },
};
