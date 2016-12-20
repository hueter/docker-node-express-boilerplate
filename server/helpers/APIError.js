/* npm packages */
const uuid = require('uuid');


/* global constants */
const correlationId = uuid.v4();


/**
 * @extends Error
 */
class ExtendableError extends Error {
  constructor(status, title, message) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.title = title;
    this.message = message;
    this.isPublic = true;
    this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
    Error.captureStackTrace(this, this.constructor.name);
  }
}

/** Class representing an API Error Response with a related HTTP Status Code **/
class APIError extends ExtendableError {
  /**
   * Create an Error Object
   * @param {number} status - The HTTP Status Code (e.g. 404)
   * @param {string} title - The title corresponding to the Status Code (e.g. Bad Request)
   * @param {string} message - Specific information about what caused the error
   */
  constructor(status = 500, title = 'Internal Server Error', message = 'An unknown server error occurred.') {
    super(status, title, message);
  }
}

/**
* Create an Error Object
* @param {Array} or {object} errors - an instance or array of instances of APIError
* return {object} format - properly-formatted JSONAPI errors object
*/
function formatError(errors) {
  let errorFormat;

  if (Array.isArray(errors)) {
    const formattedErrors = errors.map(error => {
      const formattedError = {
        status: error.status,
        title: error.title,
        detail: error.message,
      };
      return formattedError;
    });
    // wrap the array in an object
    errorFormat = { errors: formattedErrors };
  } else {
    const error = errors;
    const formattedError = {
      status: error.status,
      title: error.title,
      detail: error.message,
    };
    // wrap the object in an array and then an object
    errorFormat = { errors: [formattedError] };
  }
  return errorFormat;
}

function errorHandler(error, request, response, next) {
  let err = error;

  /* if we get an unhandled error, we want to log to console and turn it into an API error */
  if ((!(error instanceof APIError) && !(error[0] instanceof APIError))) {
    console.error(err);
    err = new APIError(500, error.type || 'Internal Server Error', error.message || 'An unknown server error occurred');
  }
  const processedErrors = formatError(err);

  response.status(processedErrors.errors[0].status || 500).json(processedErrors);
  return next();
}


module.exports = {
  APIError,
  correlationId,
  errorHandler,
  formatError,
};
