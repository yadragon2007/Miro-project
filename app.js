import express, { json } from "express";
import cookies from "cookie-parser";
import expressSession from "express-session";
import envConfig from "./config/envConfig.js";

const app = express();

/*====================== connect to database =======================*/
import database from "./config/dataBaseConfig.js";
database.database_conection();
/*====================== middleware =======================*/
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
// check Owner account
import ownerAccountCreation from "./middleware/defaultOwnerAccount.js";
app.use(ownerAccountCreation.checkOwnerAccount);
// check User Role
import userRoleCreation from "./middleware/userRoleCreation.js";
app.use(userRoleCreation.checkUserRole);
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
  res.status(404).send("not found 404");
});

/*====================== listening =======================*/
const port = envConfig.port || 8080;
app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
