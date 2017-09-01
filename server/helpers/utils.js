const { APIError } = require('./APIError');

/**
* Validate the thing POST and PATCH payloads against the appropriate schema definitions.
* @param {object} a schema validation object {the return value of v.validate(payload, schemaDefinition)}
* @return {Promise} A promise with either an errors array or just an empty success
*/
function schemaValidate(validation, type) {
  let errors = [];

  if (!validation.valid) {
    // Transpose each element of Validation.errors[] to the appropriate format
    errors = validation.errors.map(error => {
      let message;
      // console.log(error);
      if (error.name === 'additionalProperties') {
        message = `'${error.argument}' is an invalid ${type} attribute.`;
      } else {
        // Some formatting of the error messages.
        //   Example: need to replace "" with '' for better-looking JSON
        message = error.stack.replace(/"/g, "'").replace('instance.', '');
      }
      return new APIError(
        400,
        'Bad Request',
        `Schema Validation Error: ${message}`
      );
    });
  }
  return errors;
}

/**
* Validate the 'limit' query parameter
* @param {String} limit - limit query parameter
* @param {Number} maxLimit - the maximum limit you want to display
* @return {Number} or {APIError} A valid limit or an API error
*/
function limitValidate(limit, maxLimit) {
  const limitNum = +limit;

  if (isNaN(limitNum)) {
    return new APIError(
      400,
      'Bad Request',
      `Invalid limit: '${limit}'. Limit needs to be an integer.`
    );
  } else if (limitNum <= 0 || limitNum > maxLimit) {
    return new APIError(
      400,
      'Bad Request',
      `Limit of ${limit} is out of range. Limit needs to be an integer between 1 and ${maxLimit}.`
    );
  }

  return limitNum;
}

/**
* Validate the 'skip'query parameter
* @param {String} skip - skip query parameter
* @return {Number} or {APIError} A valid skip or an API error
*/
function skipValidate(skip) {
  const skipNum = +skip;

  if (isNaN(skipNum)) {
    return new APIError(
      400,
      'Bad Request',
      `Invalid skip: '${skip}'. Skip needs to be an integer.`
    );
  }
  return skipNum;
}

module.exports = { schemaValidate, limitValidate, skipValidate };
