// app imports
const { Thing } = require('../models');
const { parseSkipLimit } = require('../helpers');

/**
 * List all the things. Query params ?skip=0&limit=1000 by default
 */
async function readThings(request, response, next) {
  /* pagination validation */
  let skip = parseSkipLimit(request.query.skip, null, 'skip') || 0;
  let limit = parseSkipLimit(request.query.limit, 1000, 'limit') || 1000;
  if (typeof skip !== 'number') {
    return next(skip);
  } else if (typeof limit !== 'number') {
    return next(limit);
  }

  try {
    const things = await Thing.readThings({}, {}, skip, limit);
    return response.json(things);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  readThings
};
