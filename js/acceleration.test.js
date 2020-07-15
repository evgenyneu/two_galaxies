import getAcceleration from '../js/acceleration.js';

var expect = chai.expect;

it('getAcceleration', () => {
  var number_of_galaxies = 2;
  var masses = [1, 1];
  var positions = [[1, 0, 0], [-1, 0, 0]];

  var result = getAcceleration(number_of_galaxies, masses, positions);

  expect(result[0]).to.deep.equal([-0.25, 0, 0]);
  expect(result[1]).to.deep.equal([0.25, 0, 0]);
});
