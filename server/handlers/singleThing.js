

function getThing(request, response, next) {
  console.log('get thing');
  return next();
}

module.exports = {
  getThing,
};
