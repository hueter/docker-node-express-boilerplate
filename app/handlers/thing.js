// npm packages
const { validate } = require("jsonschema");

// app imports
const { Thing } = require("../models");
const { APIError } = require("../helpers");
const { thingNewSchema, thingUpdateSchema } = require("../schemas");

/**
 * Validate the POST request body and create a new Thing
 */
async function createThing(request, response, next) {
  const validation = validate(request.body, thingNewSchema);
  if (!validation.valid) {
    return next(
      new APIError(
        400,
        "Bad Request",
        validation.errors.map(e => e.stack).join(". ")
      )
    );
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

  const validation = validate(request.body, thingUpdateSchema);
  if (!validation.valid) {
    return next(
      new APIError(
        400,
        "Bad Request",
        validation.errors.map(e => e.stack).join(". ")
      )
    );
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
