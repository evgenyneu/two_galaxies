import get_acceleration from '../js/acceleration.js';

describe('get_acceleration', function () {
  var expect = chai.expect;

  it('should return -1 when the value is not present', () => {
    var number_of_galaxies = 2;
    var masses = [1, 1];
    var positions = [[1, 0, 0], [-1, 0, 0]];

    var result = get_acceleration(number_of_galaxies, masses, positions);

    // expect(result[0]).to.equal([-0.25, 0, 0]);
    // expect(result[1]).to.equal([0.25, 0, 0]);
  });
});
