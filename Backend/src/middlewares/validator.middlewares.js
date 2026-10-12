import { validationResult } from "express-validator";
import ApiError from "../utils/api-error.js";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const extractedErrors = [];
  errors.array().forEach((err) =>
    extractedErrors.push({ [err.path]: err.msg })
  );

  // Pass message as string, errors as array
  throw new ApiError(422, null, "Received data is not valid", extractedErrors);
};

export default validate;