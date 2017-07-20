/* npm packages */
const express = require('express');

/* app imports */
const { singleThingHandler, manyThingsHandler } = require('../handlers');

/* global constants */
const router = new express.Router();

/* All the Things Route */
router
  .route('')
  .get(manyThingsHandler.listThings)
  .post(manyThingsHandler.createThing)
  .delete(manyThingsHandler.removeThings);

/* Single Thing by Name Route */
router
  .route('/:name')
  .get(singleThingHandler.getThing)
  .patch(singleThingHandler.updateThing)
  .delete(singleThingHandler.removeThing);

module.exports = router;
