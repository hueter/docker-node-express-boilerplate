const { APIError } = require('./APIError');


/**
* Validate the institutions POST and PATCH payloads against the appropriate schema definitions.
* @param {object} a schema validation object {the return value of v.validate(payload, schemaDefinition)}
* @return {Promise} A promise with either an errors array or just an empty success
*/
function schemaValidate(validation) {
  let errors = [];

  if (!validation.valid) {
    // Transpose each element of Validation.errors[] to the appropriate format
    errors = validation.errors.map(error => {
      let message;
      // console.log(error);
      if (error.name === 'additionalProperties') {
        message = `'${error.argument}' is an invalid institution attribute.`;
      } else {
        // Some formatting of the error messages.
        //   Example: need to replace "" with '' for better-looking JSON
        let errMsg = error.stack.replace(/"/g, '\'');
        errMsg = errMsg.replace('instance.', '');
        message = `${errMsg}.`;
      }
      return new APIError(400, 'Bad Request', `Schema Validation Error: ${message}`);
    });
  }
  return errors;
}

/**
* Validate the 'limit' query parameter
* @param {string} limit - limit query parameter
* @return {Promise} A promise with either an errors array or just an empty success
*/
function limitValidate(limit) {
  const limitNum = Number(limit);

  if (isNaN(limitNum)) {
    return new APIError(400, 'Bad Request', `Invalid limit: '${limit}'. Limit needs to be an integer.`);
  } else if (limitNum <= 0 || limitNum > 50) {
    return new APIError(400, 'Bad Request', `Limit of ${limit} is out of range. Limit needs to be between 1 and 100.`);
  }

  return limitNum;
}

/**
* Validate the 'skip'query parameter
* @param {string} skip - skip query parameter
* @return {Promise} A promise with either an errors array or just an empty success
*/
function skipValidate(skip) {
  const skipNum = Number(skip);

  if (isNaN(skipNum)) {
    return new APIError(400, 'Bad Request', `Invalid skip: '${skip}'. Skip needs to be an integer.`);
  }
  return skipNum;
}

module.exports = { schemaValidate, limitValidate, skipValidate };
