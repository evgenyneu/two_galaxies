import * as vector from '../js/vector.js';
import getAccelerations from '../js/acceleration.js';

export default function integrateOneStep(timeStep, masses, positions,
                                         velocities, accelerations) {
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

  return { positions, velocities, accelerations };
}
