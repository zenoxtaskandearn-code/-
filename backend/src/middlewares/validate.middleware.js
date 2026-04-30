const ApiError = require("../utils/apiError");

const validate = (schema, property = "body") => (req, _res, next) => {
  const result = schema.safeParse(req[property]);

  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    return next(new ApiError(400, "Validation failed", details));
  }

  req[property] = result.data;
  return next();
};

module.exports = validate;
