const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let status = err.status || "error";
  let code = err.code || "0000";

  if (err.name === "ValidationError") {
    statusCode = 400;
    status = "fail";
    code = "0001";
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  if (err.name === "CastError") {
    statusCode = 400;
    status = "fail";
    code = "0002";
    message = "Invalid ID format";
  }

  if (err.code === 11000) {
    statusCode = 409;
    status = "fail";
    code = "0003";
    message = "Duplicate field value";
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    status = "fail";
    code = "0004";
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    status = "fail";
    code = "0005";
    message = "Token expired";
  }

  const response = { status, message, code };
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;

