import * as vector from './vector.js';
import getAccelerations from './acceleration.js';


/**
 * Use one step of Leapfrog method to calculate updated positions,
 * velocities and accelerations of bodies. The supplied `positions`,
 * `velocities` and `accelerations` arrays are updated with new values.
 *
 * @param  {number} timeStep    Length of the time increment.
 * @param  {array} masses       The masses of the two cores, i.e. [1, 1.5]
 * @param  {array} positions    Position vectors of all bodies,
 *                              first two are galaxy cores, the rest are stars.
 * @param  {array} velocities   Velocity vectors of all bodies.
 * @param  {array} accelerations Acceleration vectors of all bodies.
 */
export default function integrateOneStep(timeStep, masses, positions,
                                         velocities, accelerations) {

  let halfTimeStep = 0.5 * timeStep;

  for(let i = 0; i < positions.length; i++) {
    for(let k = 0; i < 3; k++) {
      velocities[i*3 + k] = velocities[i*3 + k] + halfTimeStep * accelerations[i*3 + k];
      positions[i*3 + k] = positions[i*3 + k] + timeStep * velocities[i*3 + k];
    }
  }

  getAccelerations(masses, positions, accelerations);

  for(let i = 0; i < positions.length; i++) {
    for(let k = 0; i < 3; k++) {
      velocities[i*3 + k] = velocities[i*3 + k] + halfTimeStep * accelerations[i*3 + k];
    }
  }
}
