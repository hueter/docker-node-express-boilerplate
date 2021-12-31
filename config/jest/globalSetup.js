const { MongoMemoryServer } = require("mongodb-memory-server");

module.exports = async function () {
  global.__MONGO_MEMORY_SERVER_INSTANCE__ = await MongoMemoryServer.create();
  process.env.MONGODB_URI = `mongodb://localhost:27017/boilerplate-test`;
};
