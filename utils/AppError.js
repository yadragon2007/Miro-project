class AppError extends Error {
  constructor(message, statusCode, code = "0000") {
    super(message);
    this.statusCode = statusCode;
    this.code = String(code).padStart(4, "0");
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
