import { body, validationResult, header } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const myValidationResult = validationResult.withDefaults({
  formatter: (error) => error.msg,
});

const validateBodyProperties = (allowedProperties, notEmpty) => {
  function NotEmptyCheck(req, res, next) {
    const bodyPropertiesLength = Object.keys(req.body).length;
    if (bodyPropertiesLength === 0 && notEmpty)
      throw new AppError("body properties required", 422, 1200);
    else next();
  }

  function check(req, res, next) {
    const bodyProperties = Object.keys(req.body);
    const invalidProperties = bodyProperties.filter(
      (property) => !allowedProperties.includes(property)
    );
    if (invalidProperties.length > 0)
      throw new AppError(
        `Invalid properties: ${invalidProperties.join(", ")}`,
        422,
        1201,
      );
    else next();
  }

  return [check, NotEmptyCheck];
};

const errorHandler = (req, res, next) => {
  const errors = myValidationResult(req);
  if (!errors.isEmpty())
    throw new AppError(errors.array().join(", "), 422, 1202);
  else next();
};

export default {
  validateBodyProperties,
  errorHandler,
};
