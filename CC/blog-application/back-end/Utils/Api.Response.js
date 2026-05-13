// ### ApiResponse Utility


class ApiResponse {
    // Constructor to initialize the response object
    constructor(statusCode, data, message = "Success") {
      this.statusCode = statusCode;  // HTTP status code (e.g., 200 for success, 500 for error)
      this.data = data;              // Data to return in the response (can be null)
      this.message = message;        // Message providing more context (default: "Success")
      this.success = statusCode < 400; // Automatically set success to true for statusCode < 400, false otherwise
    }
  }

// The `ApiResponse` class provides a standardized way to handle and structure API responses.

// ### Features
// - Consistent response structure with `statusCode`, `data`, `message`, and `success`.
// - The `success` field is automatically set to `true` if `statusCode` is less than 400, indicating a successful request.
// - Customizable `message` for additional context (default: "Success").
// - `statusCode`, `data`, and `message` are configurable when creating a new response.

// ### Parameters
// - `statusCode` (number): The HTTP status code of the response (e.g., 200 for success, 404 for not found).
// - `data` (any): The main data to return in the response (can be an object, array, or null if no data is provided).
// - `message` (string, optional): A message providing additional information about the response (default: "Success").

// ### Example Usage
// ```javascript
// import { ApiResponse } from './utils/response.js';
//
// // Example route using ApiResponse
// app.get('/example', (req, res) => {
//   try {
//     const data = { user: 'John Doe' };
//     // Create a success response
//     const response = new ApiResponse(200, data, 'User data fetched successfully');
//     res.json(response);
//   } catch (error) {
//     // Create an error response
//     const response = new ApiResponse(500, null, 'Internal Server Error');
//     res.status(500).json(response);
//   }
// });
// ```


  
  // ### Example Responses
  
  // #### Success Response Example
  // ```javascript
  // const successResponse = new ApiResponse(200, { user: 'John Doe' }, 'User data fetched successfully');
  // console.log(successResponse);
  // // Output:
  // // {
  // //   statusCode: 200,
  // //   data: { user: 'John Doe' },
  // //   message: 'User data fetched successfully',
  // //   success: true
  // }
  // ```
  
  // #### Error Response Example
  // ```javascript
  // const errorResponse = new ApiResponse(500, null, 'Internal Server Error');
  // console.log(errorResponse);
  // // Output:
  // // {
  // //   statusCode: 500,
  // //   data: null,
  // //   message: 'Internal Server Error',
  // //   success: false
  // }
  // ```
  
  
  export { ApiResponse };
  