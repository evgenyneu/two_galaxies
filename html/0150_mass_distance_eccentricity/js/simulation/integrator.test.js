import getAccelerations from './acceleration.js';
import integrateOneStep from './integrator.js';

var expect = chai.expect;

it('integrateOneStep', () => {
  const masses = [1, 1];
  const positionsIn = [[1, 0, 0], [-1, 0, 0]];
  const velocitiesIn = [[0, 1, 0], [0, -1, 0]];
  const accelerationsIn = getAccelerations(masses, positionsIn);
  const timeStep = 0.01;

  var { positions, velocities, accelerations } = integrateOneStep(
    timeStep, masses, positionsIn, velocitiesIn, accelerationsIn);

  // Positions
  // --------

  expect(positions.length).to.equal(2);

  expect(positions[0]).to.deep.closeTo([0.9999875, 0.01, 0], 1e-13);
  expect(positions[1]).to.deep.closeTo([-0.9999875, -0.01, 0], 1e-13);

  // Velocities
  // --------

  expect(velocities.length).to.equal(2);

  expect(velocities[0]).to.deep.closeTo(
    [-0.24998437646471770e-2, 0.9999875014061211, 0], 1e-13);

  expect(velocities[1]).to.deep.closeTo(
    [0.24998437646471770e-2, -0.9999875014061211, 0], 1e-13);

  // Accelerations
  // --------

  expect(accelerations.length).to.equal(2);

  expect(accelerations[0]).to.deep.closeTo(
    [-0.24996875292943543, -0.0024997187757790514, 0], 1e-13);

  expect(accelerations[1]).to.deep.closeTo(
    [0.24996875292943543, 0.0024997187757790514, 0], 1e-13);
});
