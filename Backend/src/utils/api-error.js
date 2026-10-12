class ApiError extends Error {
  constructor(
    statusCode,
    data = null,
    message = "Something went wrong",
    errors = []
  ) {
    super(message); // sets this.message automatically
    this.statusCode = statusCode;
    this.data = data;
    this.success = false;
    this.errors = errors;

    // Ensures stack trace starts at this constructor
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
