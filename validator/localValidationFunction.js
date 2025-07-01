import { body, validationResult, header } from "express-validator";
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => error.msg,
});

const validateBodyProperties = (allowedProperties, notEmpty) => {
  function NotEmptyCheck(req, res, next) {
    const bodyPropertiesLength = Object.keys(req.body).length;
    if (bodyPropertiesLength === 0 && notEmpty)
      return res.status(422).json({
        errors: `body properties required`,
      });
    else next();
  }

  function check(req, res, next) {
    const bodyProperties = Object.keys(req.body);
    const invalidProperties = bodyProperties.filter(
      (property) => !allowedProperties.includes(property)
    );

    if (invalidProperties.length > 0)
      return res.status(422).json({
        errors: `Invalid properties: ${invalidProperties.join(", ")}`,
      });
    else next();
  }

  return [check, NotEmptyCheck];
};

const errorHandler = (req, res, next) => {
  const errors = myValidationResult(req);
  if (!errors.isEmpty()) return res.status(422).send(errors);
  else next();
};

export default {
  validateBodyProperties,
  errorHandler,
};
