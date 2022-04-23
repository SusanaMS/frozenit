import { validationResult } from "express-validator";

const checkValidation = (req, res) => {
  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    console.error({ errors: result.array() });
    return result.array().toString();
  }
};

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};

export { checkValidation };
