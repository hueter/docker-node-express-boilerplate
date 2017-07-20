/* npm packages */
const { Validator } = require('jsonschema');

/* app imports */
const Thing = require('../models/thing');
const { thingPatchFormat } = require('../schemas');
const utils = require('../helpers/utils');

/* global constants */
const v = new Validator();

/**
 * Get a single thing
 * @param {String} name - the name of the Thing to retrieve
 */
function getThing(request, response, next) {
  const { name } = request.params;
  return Thing.get(name)
    .then(thng => response.json(thng))
    .catch(dbError => next(dbError));
}

/**
 * Remove a single thing
 * @param {String} name - the name of the Thing to remove
 */
function removeThing(request, response, next) {
  const { name } = request.params;
  return Thing.delete(name)
    .then(() => {
      const deleteMsg = {
        Success: [
          {
            status: 200,
            title: 'Thing Deleted.',
            detail: `The thing '${name}' was deleted successfully.`
          }
        ]
      };
      return response.json(deleteMsg);
    })
    .catch(dbError => next(dbError));
}

/**
 * Update a single thing
 * @param {String} name - the name of the Thing to update
 */
function updateThing(request, response, next) {
  const { name } = request.params;
  const validationErrors = utils.schemaValidate(
    v.validate(request.body, thingPatchFormat)
  );
  if (validationErrors.length > 0) {
    return next(validationErrors);
  }
  return Thing.patch(name, request.body)
    .then(thng => response.json(thng))
    .catch(dbError => next(dbError));
}

module.exports = {
  getThing,
  removeThing,
  updateThing
};
