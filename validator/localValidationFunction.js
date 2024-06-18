import { body, validationResult, header } from "express-validator";
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => error.msg,
});


const validateBodyProperties = (allowedProperties) => {
  function check(req, res, next) {
    const bodyProperties = Object.keys(req.body);
    const invalidProperties = bodyProperties.filter(
      (property) => !allowedProperties.includes(property)
    );

    if (invalidProperties.length > 0) {
      return res.status(400).json({
        errors: `Invalid properties: ${invalidProperties.join(", ")}`,
      });
    }
    next();
  }

  return check;
};

const errorHandler = (req, res, next) => {
  const errors = myValidationResult(req);
  if (!errors.isEmpty()) return res.status(400).send(errors);
  else next();
};

export default {
  validateBodyProperties,
  errorHandler,
};
