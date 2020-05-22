/** Class representing an API Error Response with a related HTTP Status Code **/
class APIError extends Error {
  /**
   * Create an Error Object
   * @param {Number} status - The HTTP Status Code (e.g. 404)
   * @param {String} title - The title corresponding to the Status Code (e.g. Bad Request)
   * @param {String} message - Specific information about what caused the error
   */
  constructor(
    status = 500,
    title = "Internal Server Error",
    message = "An unknown server error occurred."
  ) {
    super(message);
    this.status = status;
    this.title = title;
    this.message = message;
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
