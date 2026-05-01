import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Role from "../models/roleModel.js";
import Accounts from "../models/accountsModel.js";
import Owner from "../models/ownersModel.js";
import Employee from "../models/employeeModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

test("role fullAccess must be boolean", () => {
  assert.equal(Role.schema.path("fullAccess").instance, "Boolean");
});

test("password fields must be hidden by default", () => {
  assert.equal(Accounts.schema.path("password").options.select, false);
  assert.equal(Owner.schema.path("password").options.select, false);
  assert.equal(Employee.schema.path("password").options.select, false);
});

test("authorization middleware must not write identity into req.body", () => {
  const authFile = fs.readFileSync(
    path.join(root, "middleware", "authorization.js"),
    "utf8"
  );
  assert.equal(authFile.includes("req.body.userId"), false);
  assert.equal(authFile.includes("req.auth = { userId"), true);
});

test("promo expiration validation must compare timestamps correctly", () => {
  const ticketsValidatorFile = fs.readFileSync(
    path.join(root, "validator", "ticketsValidator.js"),
    "utf8"
  );
  assert.equal(
    ticketsValidatorFile.includes("promoCode.expirationDate.getTime() < date.getTime()"),
    true
  );
});
