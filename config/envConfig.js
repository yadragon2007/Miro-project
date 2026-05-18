import dotenv from "dotenv";
dotenv.config();

const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export default {
  Email: {
    email: requireEnv("EMAIL"),
    password: requireEnv("PASSWORD"),
  },
  JWT: {
    secret: requireEnv("JWT_SECRET_KEY"),
    expire: requireEnv("JWT_EXPIRE"),
  },
  Activation: {
    secret: requireEnv("ACTIVATION_SECRET"),
    expire: requireEnv("ACTIVATION_EXPIRE"),
  },
  ExchangeRate_API: {
    apiKey: requireEnv("EXCHANGE_API_KEY"),
  },
  sessionSecret: requireEnv("SESSION_SECRET"),
  dbUri: requireEnv("MONGODB_URI"),
  port: process.env.PORT || "8080",
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : ["http://localhost:8080"],
  Owner: {
    email: requireEnv("OWNER_ACCOUNT_EMAIL"),
    password: requireEnv("OWNER_ACCOUNT_PASSWORD"),
  },
};
