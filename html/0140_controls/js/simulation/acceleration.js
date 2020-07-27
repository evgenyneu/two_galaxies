import * as vector from './vector.js';


/**
 * Calculate accelerations of all bodies (cores and stars) due
 * to gravitational forces of the galaxy cores. We ignore forces from stars.
 *
 * @param  {array} masses     Masses of the galaxy cores.
 * @param  {array} positions  Position vectors of all bodies,
 *                            first two are galaxy cores, the rest are stars.
 * @param {array} accelerations Acceleration vectors of all bodies. The array
 *                            will be updated with new accelerations.
 */
export default function getAccelerations(masses, positions, accelerations) {
  // Loop over all bodies
  // The first two bodies are galaxy cores, the rest are stars
  for(let i = 0; i < positions.length / 3; i++) {
    // Set acceleration of the i-th body to zero
    accelerations.fill(0, i*3, i*3 + 3);

    // Loop over two galaxy cores
    for(let j = 0; j < 2; j++) {
      // Skip the case when the body is the same core,
      // since it can't accelerate itself
      if (i == j) continue;

      // Find displacement vector from i-th body to j-th galaxy core
      let displacement = [positions[j*3 + 0] - positions[i*3 + 0],
                          positions[j*3 + 1] - positions[i*3 + 1],
                          positions[j*3 + 2] - positions[i*3 + 2]];

      // Find the distance from i-th body to j-th galaxy core
      let distanceSquared = displacement[0] * displacement[0] +
                            displacement[1] * displacement[1] +
                            displacement[2] * displacement[2];

      let distance = Math.sqrt(distanceSquared);

      // Find the unit vector in direction from i-th body to j-th core
      for(let k = 0; k < 3; k++) {
        displacement[k] /= distance;
      }

      // Calculate the acceleration of i-th body cased by gravitational
      // force from j-th galaxy core. We are using two physical laws here:
      //
      //   1) Newton's second law:
      //
      //            F = m a,                         (1)
      //
      //      where
      //        F is force vector,
      //        m is body mass,
      //        a is acceleration vector.
      //
      //   2) Newton's law of universal gravitation:
      //
      //            F = G m M d / r^2,               (2)
      //
      //      where
      //        G is gravitational constant, set to 1 for simplicity,
      //        M is the mass of a galaxy core,
      //        d is a direction unit vector from a body to the core,
      //        r is distance between a body and a core.
      //
      // After we equate Eq. 1 and 2, the body mass m cancels and we get
      //
      //            a = M d / r^2.
      //

      // Add the acceleration to accelerations from the other cores
      // to find total acceleration of the i-th body
      for(let k = 0; k < 3; k++) {
        accelerations[i*3 + k] = accelerations[i*3 + k] + masses[j] / distanceSquared * displacement[k];
      }
    }
  }
}
