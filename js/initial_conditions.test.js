import * as init from '../js/initial_conditions.js';

var expect = chai.expect;

describe('Initial conditions', () => {
  it('numberOfStarsInOneRing', () => {
    expect(init.numberOfStarsInOneRing(1)).to.equal(12);
    expect(init.numberOfStarsInOneRing(2)).to.equal(18);
    expect(init.numberOfStarsInOneRing(3)).to.equal(24);
  });
});
