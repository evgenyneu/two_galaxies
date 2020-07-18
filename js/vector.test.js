import * as vector from '../js/vector.js';

var expect = chai.expect;

describe('Vector', () => {
  it('add', () => {
    expect(vector.add([3, 1, 3], [-2, 5, 6])).to.deep.equal([1, 6, 9]);
  });

  it('subtract', () => {
    expect(vector.subtract([3, 1, 3], [-2, 5, 6])).to.deep.equal([5, -4, -3]);
  });

  it('dotProduct', () => {
    expect(vector.dotProduct([3, 1, 3], [-2, 5, 6])).to.equal(17);
  });

  it('length', () => {
    expect(vector.length([3, 1, 3])).to.closeTo(4.35889894, 1e-8);
  });

  it('multiplyByNumber', () => {
    expect(vector.multiplyByNumber(2, [3, 1, 1.5])).to.deep.equal([6, 2, 3]);
  });
});
