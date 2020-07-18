import getAccelerations from '../js/acceleration.js';
import integrateOneStep from '../js/integrator.js';

var expect = chai.expect;

it('integrateOneStep', () => {
  const masses = [1, 1];
  const positionsIn = [[1, 0, 0], [-1, 0, 0]];
  const velocitiesIn = [[0, 1, 0], [0, -1, 0]];

  const timeStep = 0.01;

  var { positions, velocities, accelerations } = integrateOneStep(timeStep, masses, positionsIn, velocitiesIn);

  expect(positions[0]).to.deep.equal([-0.25, 0, 0]);
});
