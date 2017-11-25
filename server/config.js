const ENV = process.env.NODE_ENV;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://mongodb/boilerplate';
const PORT = process.env.PORT || 5000;

module.exports = {
  ENV,
  MONGODB_URI,
  PORT
};
