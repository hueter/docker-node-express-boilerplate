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
   * @param {Number} status - The HTTP Status Code (e.g. 404)
   * @param {String} title - The title corresponding to the Status Code (e.g. Bad Request)
   * @param {String} message - Specific information about what caused the error
   */
  constructor(
    status = 500,
    title = 'Internal Server Error',
    message = 'An unknown server error occurred.'
  ) {
    super(status, title, message);
  }
  toJSON() {
    const { status, title, message } = this;
    return {
      error: {
        status,
        title,
        message
      }
    };
  }
}

module.exports = APIError;
