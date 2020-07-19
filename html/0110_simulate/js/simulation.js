import * as init from '../../../js/initial_conditions.js';
import getAccelerations from '../../../js/acceleration.js';


export function setInitial(initialParams, currentParams) {
  var { positions, velocities } = init.allPositionsAndVelocities(initialParams);

  currentParams.accelerations = getAccelerations(initialParams.masses,
                                                 positions);

  currentParams.positions = positions;
  currentParams.velocities = velocities;
}
