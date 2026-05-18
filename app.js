import express, { json } from "express";
import cookies from "cookie-parser";
import expressSession from "express-session";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import envConfig from "./config/envConfig.js";

const app = express();

app.set("trust proxy", 1);

/*====================== connect to database =======================*/
import database from "./config/dataBaseConfig.js";
database.database_conection();
/*====================== middleware =======================*/
// json
app.use(json());
// cookies
app.use(cookies());
// helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
      },
    },
  }),
);
// cors
app.use(
  cors({
    origin: envConfig.allowedOrigins,
    credentials: true,
  }),
);
// mongoSanitize
app.use(mongoSanitize());
// expressSession
app.use(
  expressSession({
    secret: envConfig.sessionSecret,
    resave: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30d
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.SESSION_SECURE === "true",
    },
    saveUninitialized: false,
  }),
);

/*====================== routes =======================*/
import accounts from "./routers/Accounts.js";
import activation from "./routers/avtivation.js";
import hotel from "./routers/hotel.js";
import promoCode from "./routers/promoCode.js";
import currency from "./routers/currency.js";
import owner from "./routers/owner.js";
import role from "./routers/role.js";
import employee from "./routers/employee.js";
import tickets from "./routers/tickets.js";

app.use("/api/accounts", accounts);
app.use("/api/activation", activation);
app.use("/api/hotel", hotel);
app.use("/api/promoCode", promoCode);
app.use("/api/currency", currency);
app.use("/api/owner", owner);
app.use("/api/role", role);
app.use("/api/employee", employee);
app.use("/api/ticket/", tickets);

// 404
app.use((req, res) => {
  res.status(404).json({ status: "fail", message: "Route not found", code: "0006" });
});

// Global error handler
import errorHandler from "./middleware/errorHandler.js";
app.use(errorHandler);

/*====================== listening =======================*/
const port = envConfig.port || 8080;
app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
