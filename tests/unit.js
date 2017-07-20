const { expect } = require('chai');
const {
  limitValidate,
  skipValidate
} = require('../server/helpers/utils');
const { APIError, formatError } = require('../server/helpers/APIError');

describe('Error Handler', function() {
  describe('formatError()', function() {
    it('should return a formatted single error object', function() {
      const errorObject = formatError(
        new APIError(400, 'Bad Request', 'Test Detail')
      );
      expect(errorObject).to.be.an('object');
      expect(errorObject).to.have.key('errors');
      expect(errorObject.errors[0]).to.have.property('status', 400);
      expect(errorObject.errors[0]).to.have.property('title', 'Bad Request');
      expect(errorObject.errors[0]).to.have.property('detail', 'Test Detail');
    });
    it('should return a formatted list of error objects', function() {
      const error1 = new APIError(400, 'Bad Request', 'first error');
      const error2 = new APIError(400, 'Bad Request', 'second error');
      const errors = [error1, error2];
      const errorArray = formatError(errors);
      expect(errorArray).to.be.an('object');
      expect(errorArray).to.have.key('errors');
      expect(errorArray.errors[0]).to.have.property('status', 400);
      expect(errorArray.errors[0]).to.have.property('detail', 'first error');
      expect(errorArray.errors[1]).to.have.property('detail', 'second error');
    });
  });
});

describe('Utility Functions', function() {

  describe('limitValidate()', function() {
    it('should return an API Error if a non-numeric limit is passed', function() {
      const limit = 'foo';
      const validatedLimit = limitValidate(limit);
      expect(validatedLimit).to.be.instanceof(APIError);
    });
    it('should return an API Error if zero is passed', function() {
      const limit = '0';
      const validatedLimit = limitValidate(limit);
      expect(validatedLimit).to.be.instanceof(APIError);
    });
    it('should return an API Error if a negative limit is passed', function() {
      const limit = '-1';
      const validatedLimit = limitValidate(limit);
      expect(validatedLimit).to.be.instanceof(APIError);
    });
    it('should return an API Error if a limit > max is passed', function() {
      const maximum = '100';
      const limit = '101';
      const validatedLimit = limitValidate(limit, maximum);
      expect(validatedLimit).to.be.instanceof(APIError);
    });
    it('should return a number if a valid numeric limit is passed', function() {
      const limit = '5';
      const validatedLimit = limitValidate(limit);
      expect(validatedLimit).to.be.equal(5);
    });
  });

  describe('skipValidate()', function() {
    it('should return an API Error if a non-numeric skip is passed', function() {
      const skip = 'foo';
      const validatedSkip = skipValidate(skip);
      expect(validatedSkip).to.be.instanceof(APIError);
    });
  });
});
