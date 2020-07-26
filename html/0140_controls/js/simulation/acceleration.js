import * as vector from './vector.js';


/**
 * Calculate accelerations of all bodies (cores and stars) due
 * to gravitational forces of the galaxy cores. We ignore forces from stars.
 *
 * @param  {array} masses     Masses of the galaxy cores.
 * @param  {array} positions  Position vectors of all bodies,
 *                            first two are galaxy cores, the rest are stars.
 * @return {array}            Acceleration vectors of all bodies.
 */
export default function getAccelerations(masses, positions) {
  // Create an zero vector that will store the acceleration of all bodies
  var accelerations = Array.from(Array(positions.length)).map(_ => [0, 0, 0]);

  // Loop over all bodies
  // The first two bodies are galaxy cores, the rest are stars
  for(let i = 0; i < positions.length; i++) {
    // Loop over two galaxy cores
    for(let j = 0; j < 2; j++) {
      // Skip the case when the body is the same core,
      // since it can't accelerate itself
      if (i == j) continue;

      // Find displacement vector from i-th body to j-th galaxy core
      let displacement = vector.subtract(positions[j], positions[i]);

      // Find the distance from i-th body to j-th galaxy core
      let distance = vector.length(displacement);

      // Find the unit vector in direction from i-th body to j-th core
      let direction = vector.multiplyByNumber(1 / distance, displacement);

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
      let acceleration = vector.multiplyByNumber(
        masses[j] / Math.pow(distance, 2), direction);

      // Add the acceleration to accelerations from the other cores
      // to find total acceleration of the i-th body
      accelerations[i] = vector.add(acceleration, accelerations[i]);
    }
  }

  return accelerations;
}
