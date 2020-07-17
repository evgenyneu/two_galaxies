import * as vector from '../js/vector.js';

/**
 * Calculate the number of stars in a single ring of a galaxy
 *
 * @param  {number} ringNumber  The ring number: 1, 2, 3...
 *    The ring number 1 is the closest ring to the center of the galaxy.
 * @return {number} Number of stars in the ring.
 */
export function numberOfStarsInOneRing(ringNumber) {
  // The rings that are further away from the galaxy center have more stars
  return 12 + 6 * (ringNumber - 1);
}


/**
 * Find the number of stars located in all rings in one galaxy
 *
 * @param  {number} numberOfRings Number of rings in the galaxy
 * @return {number}               Total number of stars in the galaxy
 */
export function numberOfStarsInAllRingsOneGalaxy(numberOfRings) {
  var stars = 0;

  // Loop over each ring, starting from the one closer to the center
  for(let ringNumber = 1; ringNumber <= numberOfRings; ringNumber++) {
    // Calculate the number of stars in one ring and add it to the total
    stars += numberOfStarsInOneRing(ringNumber);
  }

  return stars;
}


 /**
  * Calculate positions and velocities of stars in one galaxy. The
  * stars are located in rings around the galaxy core.
  *
  * @param  {array} corePosition  Position of the core
  * @param  {array} coreVelocity  Core velocity
  * @param  {number} coreMass     Mass of the core
  * @param  {number} theta        Inclination angle of the galaxy relative
  *                               to the orbital plane of the core
  * @param  {number} numberOfRings Number of rings in the galaxy
  * @param  {number} ringSeparation Separation between two rings
  * @return {object} An object { positions: [], velocities: [] }
  *                  containing positions and velocities of all stars in the
  *                  galaxy.
  */
export function galaxyStarsPositionsAndVelocities(
  corePosition, coreVelocity, coreMass, theta, numberOfRings, ringSeparation) {

  var positions = [];
  var velocities = [];

  // Loop over the rings of the galaxy
  for(let ringNumber = 1; ringNumber <= numberOfRings; ringNumber++) {
    // Find distance of stars in current ring from the galaxy center
    let distanceFromCenter = ringNumber * ringSeparation;

    // Find number of stars in the ring
    let numberOfStars = numberOfStarsInOneRing(ringNumber);

    // Find the speed of each star circling the galaxy center. We use
    // two physical laws:
    //
    //   1) Newton's second law:
    //
    //            F = m a,                        (1)
    //
    //      where
    //        F is force vector,
    //        m is star mass,
    //        a is acceleration vector.
    //
    //   2) Newton's law of universal gravitation:
    //
    //            F = G m M / r^2,              (2)
    //
    //      where
    //        G is gravitational constant, set to 1 for simplicity,
    //        M is the mass of a galaxy core,
    //        r is distance between a body and a core.
    //
    // In Eq. 1, we can use formula for centripetal acceleration:
    //
    //            a = v^2 / r,                     (3)
    //
    // where v is the velocity of the star we want to find. Eq. 1 becomes
    //
    //            F = m v^2 / r,                   (4)
    //
    // which is the magnitude of the force that needs to be applied in order
    // to keep the star in orbit around the galaxy. This force comes from
    // gravity, so we equate Eq. 4 with Eq. 2:
    //
    //          m v^2 / r = m M / r^2.
    //
    // Star mass m and one of r cancels:
    //
    //          v^2 =  M / r.
    //
    // Finally, we take square root of both sides and get the speed we wanted:
    //
    //          v = sqrt(M / r).
    //
    let starSpeed = Math.sqrt(coreMass / distanceFromCenter);

    // Calculate the angle between two neighbouring stars in a ring
    // when viewed from the galaxy center
    let angleBetweenNeighbours = 2 * Math.PI / numberOfStars;

    // Loop over all the stars in the current ring
    for(let starNumber = 1; starNumber <= numberOfStars; starNumber++) {
      // Find the angle of the current star relative to the first
      // star in the ring
      let phi = (starNumber - 1) * angleBetweenNeighbours;

      // Calculate the position of the current star relative to galaxy's centre
      var position = [
        distanceFromCenter * Math.cos(phi) * Math.cos(theta),
        distanceFromCenter * Math.sin(phi),
        -distanceFromCenter * Math.cos(phi) * Math.sin(theta)
      ];

      // Add star's position to the position of the galaxy to find
      // the star's position in our coordinate system
      position = vector.add(corePosition, position);

      // Add star's position to the list
      positions.push(position);

      // Calculate the velocity of the star relative to galaxy's centre
      var velocity = [
        -starSpeed * Math.sin(phi) * Math.cos(theta),
        starSpeed * Math.cos(phi),
        starSpeed * Math.sin(phi) * Math.sin(theta)
      ];

      // Calculate star's velocity in our coordinate system
      velocity = vector.add(coreVelocity, velocity);

      // Store velocity in the list
      velocities.push(velocity);
    }
  }

  return { positions, velocities };
}

export function positionsVelocitiesAndAccelerations() {
  return 1;
}
