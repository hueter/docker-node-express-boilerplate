/* npm packages */
const bodyParser = require('body-parser');
const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
Promise = require('bluebird'); // eslint-disable-line no-native-reassign

/* app imports */
const { APIError, errorHandler } = require('./helpers/APIError');
const boilerplate = require('./routes');

/* global constants */
const app = express();

/* --- Database --- */
mongoose.Promise = Promise;
mongoose.set('debug', true);
const dbConfig = config.get('Boilerplate.dbConfig');
mongoose.connect(
  `mongodb://${dbConfig.host}/${dbConfig.name}`,
  dbConfig.options
);

/* --- API middleware --- */

// body parser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// error handling specific to body parser only
app.use((error, request, response, next) => {
  if (error instanceof SyntaxError || error instanceof TypeError) {
    // console.error(error);
    return next(new APIError(400, 'Bad Request', 'Malformed JSON.'));
  }
  return next();
});

// response headers setup
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Content-Type');
  response.header('Access-Control-Allow-Methods', 'POST,GET,PATCH,DELETE');
  response.header('Access-Control-Expose-Headers', 'Correlation-Id');
  response.header('Content-Type', 'application/json');
  return next();
});

app.use('/', boilerplate);
/* Generic 404 error-maker for routes that do not contain resources */
app.get('*', (request, response, next) => {
  const err = new APIError(
    404,
    'Resource Not Found.',
    `${request.path} is not valid path to a Boilerplate API resource.`
  );
  return next(err);
});
app.use(errorHandler);

app.listen(5000, () => {
  console.log('Boilerplate API express server is listening on port 5000...');
});
