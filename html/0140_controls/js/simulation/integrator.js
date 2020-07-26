import * as vector from './vector.js';
import getAccelerations from './acceleration.js';


/**
 * Use one step of Leapfrog method to calculate updated positions,
 * velocities and accelerations of bodies.
 *
 * @param  {number} timeStep    Length of the time increment.
 * @param  {array} masses       The masses of the two cores, i.e. [1, 1.5]
 * @param  {array} positions    Position vectors of all bodies,
 *                              first two are galaxy cores, the rest are stars.
 * @param  {array} velocities   Velocity vectors of all bodies.
 * @param  {array} accelerations Acceleration vectors of all bodies.
 * @return {object} An object { positions: [], velocities: [], accelerations }
 *                  containing the updated positions, velocities and
 *                  accelerations of all bodies after `timeStep` time interval.
 */
export default function integrateOneStep(timeStep, masses, positions,
                                         velocities, accelerations) {

  var t0 = performance.now();

  for(let i = 0; i < positions.length; i++) {
    velocities[i] = vector.add(
      velocities[i], vector.multiplyByNumber(0.5 * timeStep, accelerations[i]));

    positions[i] = vector.add(
      positions[i], vector.multiplyByNumber(timeStep, velocities[i]));
  }

  accelerations = getAccelerations(masses, positions);

  for(let i = 0; i < positions.length; i++) {
    velocities[i] = vector.add(
      velocities[i], vector.multiplyByNumber(0.5 * timeStep, accelerations[i]));
  }

  var t1 = performance.now();

  console.log("Elapsed: " + (t1 - t0) + " ms");

  return { positions, velocities, accelerations };
}
