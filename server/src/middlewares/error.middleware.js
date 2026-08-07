import ApiError from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // Handle Multer errors (e.g. file size limit exceeded) as 400 Bad Request
  if (err.name === "MulterError") {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File size exceeds the 100MB limit"
        : err.message;
    error = new ApiError(400, message);
  } else if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  return res.status(error.statusCode).json(response);
};

export default errorMiddleware;