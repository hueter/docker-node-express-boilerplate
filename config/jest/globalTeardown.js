module.exports = async function () {
  await global.__MONGO_MEMORY_SERVER_INSTANCE__.stop();
};
