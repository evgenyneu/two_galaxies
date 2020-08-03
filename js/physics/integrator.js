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

  const halfTimeStep = 0.5 * timeStep;
  let bodies = positions.length / 3;

  for(let i = 0; i < bodies; i++) {
    // The index of the body's coordinates
    let j = i * 3;

    // Advance velocities with half time step
    velocities[j] += halfTimeStep * accelerations[j];
    velocities[j + 1] += halfTimeStep * accelerations[j + 1];
    velocities[j + 2] += halfTimeStep * accelerations[j + 2];

    // Advance position with full time step
    positions[j] += timeStep * velocities[j];
    positions[j + 1] += timeStep * velocities[j + 1];
    positions[j + 2] += timeStep * velocities[j + 2];
  }

  // Calculate new accelerations of the bodies
  getAccelerations(masses, positions, accelerations);

  // Advance velocities with half time step
  for(let i = 0; i < bodies; i++) {
    // The index of the body's coordinates
    let j = i * 3;

    velocities[j] += halfTimeStep * accelerations[j];
    velocities[j + 1] += halfTimeStep * accelerations[j + 1];
    velocities[j + 2] += halfTimeStep * accelerations[j + 2];
  }
}
