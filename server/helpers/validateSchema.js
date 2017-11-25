const APIError = require('./APIError');

/**
* Validate the thing POST and PATCH payloads against the appropriate schema definitions.
* @param {Object} validation - schema validation object {the return value of v.validate(payload, schemaDefinition)}
* @param {String} type - the thing being validated
* @return {APIError} an APIError with a list of validation issues
*/
function validateSchema(validation, type) {
  let errors;

  if (!validation.valid) {
    errors = validation.errors.map(error => {
      switch (error.name) {
        case 'additionalProperties': {
          const immutableFields = {
            username: 1,
            favorites: 1,
            stories: 1
          };
          if (immutableFields[error.argument]) {
            return `The field '${error.argument}' is immutable at this endpoint`;
          }
          return `'${error.argument}' is an invalid ${type} attribute`;
        }
        case 'pattern':
          return `The ${error.property
            .split('.')
            .pop()} field only supports letters and numbers`;
        default:
          return error.stack.replace(/"/g, "'").replace('instance.', '');
      }
    });

    return new APIError(400, 'Bad Request', `${errors.join('; ')}.`);
  }

  return 'OK';
}

module.exports = validateSchema;
