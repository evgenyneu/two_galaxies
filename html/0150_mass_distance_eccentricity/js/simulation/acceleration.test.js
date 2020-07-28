import getAccelerations from './acceleration.js';

var expect = chai.expect;

it('getAccelerations', () => {
  var masses = [1, 1];
  var positions = [1, 0, 0, -1, 0, 0];
  var accelerations = Array(6).fill(-42);

  getAccelerations(masses, positions, accelerations);

  expect(accelerations.slice(0, 3)).to.deep.equal([-0.25, 0, 0]);
  expect(accelerations.slice(3, 6)).to.deep.equal([0.25, 0, 0]);
});
