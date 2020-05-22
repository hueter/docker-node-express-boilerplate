module.exports = async function() {
  console.log("Teardown mongod server.");
  await global.__MONGOD__.stop();
};
