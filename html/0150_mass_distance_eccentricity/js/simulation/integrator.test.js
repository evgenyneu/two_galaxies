import getAccelerations from './acceleration.js';
import integrateOneStep from './integrator.js';

var expect = chai.expect;

it('integrateOneStep', () => {
  const masses = [1, 1];
  const positions = [1, 0, 0, -1, 0, 0];
  const velocities = [0, 1, 0, 0, -1, 0];
  var accelerations = Array(6).fill(-42);
  getAccelerations(masses, positions, accelerations);
  const timeStep = 0.01;

  integrateOneStep(timeStep, masses, positions, velocities, accelerations);

  // Positions
  // --------

  expect(positions.length).to.equal(6);

  expect(positions.slice(0, 3)).to.deep.closeTo([0.9999875, 0.01, 0], 1e-13);
  expect(positions.slice(3, 6)).to.deep.closeTo([-0.9999875, -0.01, 0], 1e-13);

  // Velocities
  // --------

  expect(velocities.length).to.equal(6);

  expect(velocities.slice(0, 3)).to.deep.closeTo(
    [-0.24998437646471770e-2, 0.9999875014061211, 0], 1e-13);

  expect(velocities.slice(3, 6)).to.deep.closeTo(
    [0.24998437646471770e-2, -0.9999875014061211, 0], 1e-13);

  // Accelerations
  // --------

  expect(accelerations.length).to.equal(6);

  expect(accelerations.slice(0, 3)).to.deep.closeTo(
    [-0.24996875292943543, -0.0024997187757790514, 0], 1e-13);

  expect(accelerations.slice(3, 6)).to.deep.closeTo(
    [0.24996875292943543, 0.0024997187757790514, 0], 1e-13);
});
