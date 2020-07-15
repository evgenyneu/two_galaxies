import * as vector from '../js/vector.js';

var expect = chai.expect;

describe('vector', function() {
  it('subtract', () => {
    expect(vector.subtract([3, 1, 3], [-2, 5, 6])).to.deep.equal([5, -4, -3]);
  });

  it('dotProduct', () => {
    expect(vector.dotProduct([3, 1, 3], [-2, 5, 6])).to.equal(17);
  });
});
