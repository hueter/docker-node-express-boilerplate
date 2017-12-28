// npm packages
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
Promise = require('bluebird'); // eslint-disable-line

// app imports
const { ENV, PORT, MONGODB_URI } = require('./config');
const { errorHandler } = require('./handlers');
const { thingsRouter } = require('./routers');

// global constants
dotenv.config();
const app = express();
const {
  bodyParserHandler,
  globalErrorHandler,
  fourOhFourHandler,
  fourOhFiveHandler
} = errorHandler;
// database
mongoose.Promise = Promise;
if (ENV === 'development') {
  mongoose.set('debug', true);
}

mongoose
  .connect(MONGODB_URI, { useMongoClient: true, autoIndex: false })
  .then(() => {
    console.log('Connected to database');
  })
  .catch(err => console.error(err));

// body parser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: '*/*' }));
app.use(bodyParserHandler); // error handling specific to body parser only

// response headers setup
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header(
    'Access-Control-Allow-Headers',
    'Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization'
  );
  response.header(
    'Access-Control-Allow-Methods',
    'POST,GET,PATCH,DELETE,OPTIONS'
  );
  response.header('Content-Type', 'application/json');
  return next();
});

app.use('/things', thingsRouter);

app.get('*', fourOhFourHandler); // catch-all for 404 "Not Found" errors
app.all('*', fourOhFiveHandler); // catch-all for 405 "Method Not Allowed" errors

app.use(globalErrorHandler);

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`Boilerplate API express server is listening on port ${PORT}...`);
});
