/* npm packages */
const { Validator } = require('jsonschema');

/* app imports */
const { APIError } = require('../helpers/APIError');
const Thing = require('../models/thing');
const { thingPostFormat } = require('../schemas/index');
const utils = require('../helpers/utils');


/* global constants */
const v = new Validator();

/**
 * Validate the POST request body and create a new Thing
 */
function createThing(request, response, next) {
  const validationErrors = utils.schemaValidate(v.validate(request.body, thingPostFormat));
  if (validationErrors.length > 0) {
    return next(validationErrors);
  }
  const newThing = new Thing(request.body);
  return Thing
    .create(newThing)
    .then(thng => response.status(201).json(thng))
    .catch(dbError => next(dbError));
}

/**
 * List all the things. Query params ?skip=0&limit=1000 by default
 */
function listThings(request, response, next) {
  let skip = 0;
  let limit = 1000;

  /* pagination validation */
  if (request.query.skip) {
    skip = utils.skipValidate(request.query.skip);
    if (skip instanceof APIError) {
      return next(skip);
    }
  }
  if (request.query.limit) {
    limit = utils.limitValidate(request.query.limit);
    if (limit instanceof APIError) {
      return next(limit);
    }
  }

  return Thing
    .list({}, skip, limit)
    .then(thingsList => response.json(thingsList))
    .catch(dbError => next(dbError));
}

/**
 * Remove all the things. Will always respond with 200 OK
 */
function removeThings(request, response, next) {
  return Thing
    .deleteAll()
    .then(() => {
      const deleteMsg = {
        Success: [{
          status: 200,
          title: 'Things Deleted.',
          detail: 'All the things were deleted successfully.',
        }],
      };
      return response.json(deleteMsg);
    })
    .catch(dbError => next(dbError));
}

module.exports = {
  createThing,
  listThings,
  removeThings,
};
