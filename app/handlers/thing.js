// npm packages
const { Validator } = require('jsonschema');

// app imports
const { Thing } = require('../models');
const { thingNewSchema, thingUpdateSchema } = require('../schemas');
const { validateSchema } = require('../helpers');

// globals
const v = new Validator();

/**
 * Validate the POST request body and create a new Thing
 */
async function createThing(request, response, next) {
  const validSchema = validateSchema(
    v.validate(request.body, thingNewSchema),
    'thing'
  );
  if (validSchema !== 'OK') {
    return next(validSchema);
  }

  try {
    const newThing = await Thing.createThing(new Thing(request.body));
    return response.status(201).json(newThing);
  } catch (err) {
    return next(err);
  }
}

/**
 * Get a single thing
 * @param {String} name - the name of the Thing to retrieve
 */
async function readThing(request, response, next) {
  const { name } = request.params;
  try {
    const thing = await Thing.readThing(name);
    return response.json(thing);
  } catch (err) {
    return next(err);
  }
}

/**
 * Update a single thing
 * @param {String} name - the name of the Thing to update
 */
async function updateThing(request, response, next) {
  const { name } = request.params;

  const validationErrors = validateSchema(
    v.validate(request.body, thingUpdateSchema),
    'thing'
  );
  if (validationErrors.length > 0) {
    return next(validationErrors);
  }

  try {
    const thing = await Thing.updateThing(name, request.body);
    return response.json(thing);
  } catch (err) {
    return next(err);
  }
}

/**
 * Remove a single thing
 * @param {String} name - the name of the Thing to remove
 */
async function deleteThing(request, response, next) {
  const { name } = request.params;
  try {
    const deleteMsg = await Thing.deleteThing(name);
    return response.json(deleteMsg);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createThing,
  readThing,
  updateThing,
  deleteThing
};
