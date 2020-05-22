// npm packages
const dotenv = require("dotenv");
const express = require("express");
Promise = require("bluebird"); // eslint-disable-line

// app imports
const { connectToDatabase, globalResponseHeaders } = require("./config");
const { errorHandler } = require("./handlers");
const { thingsRouter } = require("./routers");

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
connectToDatabase();

// body parser setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: "*/*" }));
app.use(bodyParserHandler); // error handling specific to body parser only

// response headers setup; CORS
app.use(globalResponseHeaders);

app.use("/things", thingsRouter);

// catch-all for 404 "Not Found" errors
app.get("*", fourOhFourHandler);
// catch-all for 405 "Method Not Allowed" errors
app.all("*", fourOhFiveHandler);

app.use(globalErrorHandler);

/**
 * This file does NOT run the app. It merely builds and configures it then exports it.config
 *  This is for integration tests with supertest (see __tests__).
 */
module.exports = app;
