/* npm packages */
const express = require('express');

/* app imports */
const { singleThingHandler, manyThingsHandler } = require('../handlers/index');


/* global constants */
const router = new express.Router();

/* All the Things Route */
router.route('')
  .get()
  .post()
  .delete();

/* Single Thing by Name Route */
router.route('/:name')
  .get()
  .patch()
  .delete();


module.exports = router;
