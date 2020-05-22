// npm packages
const express = require("express");

// app imports
const { thingHandler, thingsHandler } = require("../handlers");

// globals
const router = new express.Router();
const { readThings } = thingsHandler;
const { createThing, readThing, updateThing, deleteThing } = thingHandler;

/* All the Things Route */
router
  .route("")
  .get(readThings)
  .post(createThing);

/* Single Thing by Name Route */
router
  .route("/:name")
  .get(readThing)
  .patch(updateThing)
  .delete(deleteThing);

module.exports = router;
