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

test("controllers must not leak raw error objects to client", () => {
  const controllerFiles = [
    "AccountsController.js",
    "accountsActivationController.js",
    "currencyController.js",
    "employeeController.js",
    "hotelController.js",
    "ownerController.js",
    "promoCodeController.js",
    "roleController.js",
    "ticketsController.js",
  ];
  for (const file of controllerFiles) {
    const content = fs.readFileSync(
      path.join(root, "controllers", file),
      "utf8"
    );
    // Should not send raw error to client in catch blocks
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Check for patterns like `error, error}` or `{ message: error }` or `{ msg: ... error }`
      if (
        line.includes("send({ message: error") ||
        line.includes("send({ msg: `Internal Server Error`, error") ||
        line.includes("send({ message: error,")
      ) {
        assert.fail(`${file}:${i + 1} leaks error object: ${line.trim()}`);
      }
    }
  }
});

test("app.js must use mongoSanitize middleware", () => {
  const appFile = fs.readFileSync(
    path.join(root, "app.js"),
    "utf8"
  );
  assert.equal(appFile.includes("mongoSanitize"), true);
  assert.equal(appFile.includes('import mongoSanitize'), true);
  assert.equal(appFile.includes("app.use(mongoSanitize()"), true);
});

test("app.js must have trust proxy enabled", () => {
  const appFile = fs.readFileSync(
    path.join(root, "app.js"),
    "utf8"
  );
  assert.equal(appFile.includes('app.set("trust proxy", 1)'), true);
});

test("controllers must not pass req.body directly to find/findOne/findByIdAndUpdate", () => {
  const filesToCheck = [
    { path: path.join(root, "controllers", "roleController.js"), name: "roleController" },
    { path: path.join(root, "controllers", "currencyController.js"), name: "currencyController" },
  ];
  for (const { path: filePath, name } of filesToCheck) {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Check for patterns like RoleServes.getRole(data) where data = req.body
      if (
        (line.includes("= req.body") && line.includes("let data") || line.includes("const data = req.body")) &&
        !line.includes("const {") &&
        !line.includes("{ ")
      ) {
        assert.fail(`${name}.js:${i + 1} passes req.body directly: ${line.trim()}`);
      }
    }
  }
});

test("promoCodeController must destructure req.body in addPromoCode", () => {
  const content = fs.readFileSync(
    path.join(root, "controllers", "promoCodeController.js"),
    "utf8"
  );
  assert.equal(content.includes("const { code, expirationDate, forAllHotels"), true);
  assert.equal(content.includes("const newPromoCode = new PromoCode(req.body)"), false);
});

test("employeeController must destructure req.body in addEmployee", () => {
  const content = fs.readFileSync(
    path.join(root, "controllers", "employeeController.js"),
    "utf8"
  );
  assert.equal(content.includes("const { fullName, email, password, role } = req.body"), true);
  assert.equal(content.includes("employeeService.addEmployee(req.body)"), false);
});

test("hotelController must not contain buildSafeFilter", () => {
  const content = fs.readFileSync(
    path.join(root, "controllers", "hotelController.js"),
    "utf8"
  );
  assert.equal(content.includes("buildSafeFilter"), false);
});

test("image deletion validator must reject path traversal", () => {
  const content = fs.readFileSync(
    path.join(root, "validator", "hotelValidator.js"),
    "utf8"
  );
  assert.equal(content.includes("matches(/^[a-zA-Z0-9_-]+$/)"), true);
  assert.equal(content.includes("matches(/^[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9]+)?$/)"), true);
});

test("activation middleware must set req.auth", () => {
  const content = fs.readFileSync(
    path.join(root, "middleware", "authorization.js"),
    "utf8"
  );
  assert.equal(content.includes("req.auth = { userId: user.id }"), true);
});

test("global error handler must be imported and used in app.js", () => {
  const content = fs.readFileSync(
    path.join(root, "app.js"),
    "utf8"
  );
  assert.equal(content.includes("import errorHandler from"), true);
  assert.equal(content.includes("app.use(errorHandler)"), true);
  assert.equal(content.includes("app.use((err, req, res, next) =>"), false);
});

test("404 handler must return JSON with code string", () => {
  const content = fs.readFileSync(
    path.join(root, "app.js"),
    "utf8"
  );
  assert.equal(content.includes(".json({ status: \"fail\", message: \"Route not found\", code: \"0006\" })"), true);
  assert.equal(content.includes(".send(\"not found 404\")"), false);
});

test("AppError class must format code as 4-digit string", () => {
  const content = fs.readFileSync(
    path.join(root, "utils", "AppError.js"),
    "utf8"
  );
  assert.equal(content.includes("constructor(message, statusCode, code = \"0000\")"), true);
  assert.equal(content.includes("this.code = String(code).padStart(4, \"0\")"), true);
});

test("error response must include 4-digit code string in errorHandler", () => {
  const content = fs.readFileSync(
    path.join(root, "middleware", "errorHandler.js"),
    "utf8"
  );
  assert.equal(content.includes('const response = { status, message, code }'), true);
  assert.equal(content.includes('|| "0000"'), true);
  assert.equal(content.includes('= "0001"'), true);
  assert.equal(content.includes('= "0002"'), true);
  assert.equal(content.includes('= "0003"'), true);
  assert.equal(content.includes('= "0004"'), true);
  assert.equal(content.includes('= "0005"'), true);
});

test("authorization middleware must not have try/catch blocks", () => {
  const content = fs.readFileSync(
    path.join(root, "middleware", "authorization.js"),
    "utf8"
  );
  assert.equal(content.includes("try {"), false);
  assert.equal(content.includes("} catch"), false);
});
