import { body, validationResult } from "express-validator";
import Role from "../models/roleModel.js";

const addRole = [
  body("roleName")
    .notEmpty()
    .withMessage("roleName must not be empty")
    .isString()
    .withMessage("roleName must be String")
    .custom(async (roleName) => {
      const role = await Role.findOne({ roleName });
      if (role)
        return Promise.reject(
          new Error(`there is no room with this name (${roleName})`)
        );
    }),
  body("permissions").isArray().withMessage("permissions must be array"),
  body("permissions.*")
    .notEmpty()
    .withMessage("permissions indexes must not be empty")
    .isObject()
    .withMessage("permissions indexes must be object"),
  body("permissions.*.url")
    .notEmpty()
    .withMessage("permissions.*.url must not be empty")
    .isString()
    .withMessage("permissions.*.url must be String"),
  body("permissions.*.method")
    .notEmpty()
    .withMessage("permissions.*.method must not be empty")
    .isString()
    .withMessage("permissions.*.method must be String")
    .isIn(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"])
    .withMessage(
      'permissions.*.method must be one of them ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]'
    ),
];

export default { addRole };
