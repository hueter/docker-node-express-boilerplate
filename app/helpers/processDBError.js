const APIError = require('./APIError');

function processDBError(dbError) {
  let error = dbError;
  if (!(error instanceof APIError)) {
    error = new APIError(
      500,
      error.name || 'Internal Server Error',
      `Internal Database Error: ${error}`
    );
  }
  return error;
}

module.exports = processDBError;
