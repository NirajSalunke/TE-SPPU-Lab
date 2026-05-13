// ### ApiError Utility

// The `ApiError` class provides a standardized way to handle API errors in the project.

// ### Features
// - Consistent error structure for API responses.
// - Includes `statuscode` (HTTP status code), `message`, `errors` (details), and optional `stack` (debugging information).
// - Automatically captures stack traces for better debugging.

// ### Parameters
// - `statuscode` (number): HTTP status code (e.g., 400, 404, 500).
// - `message` (string): Description of the error (default: "Something went wrong").
// - `errors` (array): Additional error details (e.g., validation errors).
// - `stack` (string, optional): Custom stack trace for debugging (default: automatically captured).

// ### Example Usage
// ```javascript
// import { ApiError } from './utils/error.js';

// // Example route using ApiError
// app.get('/example', (req, res, next) => {
//   try {
//     throw new ApiError(400, 'Invalid input', ['Missing field: username']);
//   } catch (error) {
//     next(error); // Pass the error to the middleware
//   }
// });
// ```



class ApiError extends Error {
    constructor(
      statuscode = 500, // Default to internal server error
      message = "Something went wrong",
      errors = [],
      stack = ""
    ) {
      super(message);
  
      // Ensure statuscode is a valid number
      this.statuscode = Number.isInteger(statuscode) ? statuscode : 500;
      this.data = null;
      this.message = message;
      this.success = false;
      this.errors = Array.isArray(errors) ? errors : [];
  
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  
  export { ApiError };
  