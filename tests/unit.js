const { expect } = require('chai');
const { APIError, parseSkipLimit } = require('../server/helpers');

describe('Helper Functions', function() {
  describe('parseSkipLimit()', function() {
    it('should return a number if a valid limit is passed', function() {
      const limit = '6';
      const validatedLimit = parseSkipLimit(limit);
      expect(validatedLimit).to.equal(6);
    });
    it('should return an API Error if a non-numeric limit is passed', function() {
      const limit = 'foo';
      const validatedLimit = parseSkipLimit(limit);
      expect(validatedLimit).to.be.instanceof(APIError);
    });
    it('should return an API Error if zero is passed when type is "limit"', function() {
      const limit = '0';
      const validatedLimit = parseSkipLimit(limit);
      expect(validatedLimit).to.be.instanceof(APIError);
    });
    it('should return zero if zero is passed when the type is "skip"', function() {
      const skip = '0';
      const validatedLimit = parseSkipLimit(skip, 1000, 'skip');
      expect(validatedLimit).to.equal(0);
    });
    it('should return an API Error if a negative limit is passed', function() {
      const limit = '-1';
      const validatedLimit = parseSkipLimit(limit);
      expect(validatedLimit).to.be.instanceof(APIError);
    });
    it('should return an API Error if a limit > max is passed', function() {
      const maximum = 100;
      const limit = '101';
      const validatedLimit = parseSkipLimit(limit, maximum);
      expect(validatedLimit).to.be.instanceof(APIError);
    });
    it('should return a number if a valid numeric limit is passed', function() {
      const limit = '5';
      const validatedLimit = parseSkipLimit(limit);
      expect(validatedLimit).to.be.equal(5);
    });
  });
});
