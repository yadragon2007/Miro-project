import express, { json } from "express";
import cookies from "cookie-parser";
import expressSession from "express-session";
import dotenv from "dotenv";
import envConfig from "./config/envConfig.js";

const app = express();
// env
dotenv.config();

// connect to database
import database from "./config/dataBaseConfig.js";
database.database_conection();

// middleware
app.use(json());
app.use(cookies());
app.use(
  expressSession({
    secret: "secret",
    resave: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30d
    },
    saveUninitialized: false,
  })
);
/*====================== default data =======================*/
// check Owner Role
import ownerRoleCreation from "./middleware/ownerRoleCreation.js";
app.use(ownerRoleCreation.checkOwnerRole);
// check Owner accont
import ownerAccountCreation from "./middleware/defaultOwnerAccount.js";
app.use(ownerAccountCreation.checkOwnerAccount);
/*====================== routes =======================*/
// default Owner account and password
// routes
import accounts from "./routers/Accounts.js";
import activation from "./routers/avtivation.js";
import hotel from "./routers/hotel.js";
import promoCode from "./routers/promoCode.js";
import currency from "./routers/currency.js";
import owner from "./routers/owner.js";

app.use("/api/accounts", accounts);
app.use("/api/activation", activation);
app.use("/api/hotel", hotel);
app.use("/api/promoCode", promoCode);
app.use("/api/currency", currency);
app.use("/api/owner", owner);

// 404
app.use((req, res) => {
  res.status(404).send("not found 404");
});

// listening
const port = envConfig.port || 8080;
app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
