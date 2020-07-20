import * as init from '../../../js/initial_conditions.js';
import getAccelerations from '../../../js/acceleration.js';
import integrateOneStep from '../../../js/integrator.js';

export function setInitial(initialParams, currentParams) {
  var { positions, velocities } = init.allPositionsAndVelocities(initialParams);

  currentParams.accelerations = getAccelerations(initialParams.masses,
                                                 positions);

  currentParams.positions = positions;
  currentParams.velocities = velocities;
}

export function update(timeStep, initialParams, currentParams) {
  var result = integrateOneStep(
    timeStep,
    initialParams.masses,
    currentParams.positions,
    currentParams.velocities,
    currentParams.accelerations);

  currentParams.positions = result.positions;
  currentParams.velocities = result.velocities;
  currentParams.accelerations = result.accelerations;
}
