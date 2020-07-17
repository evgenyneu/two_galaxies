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
    //            F = G m M / r^2,                (2)
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

export function allPositionsAndVelocities(options) {
  // Calculate semi-major axis of the ellipse. The ellipse is the path
  // of first galaxy core relative the second core, located at ellipse's focus.
  // The minimal separation eMin (a.k.a. periastron) between two galaxy cores
  // is given by equation:
  //
  //        rMin = a (1 - e),
  //
  //    where
  //        a is semi-major axis,
  //        e is eccentricity.
  //
  // Solving for a gives:
  //
  //        a = eMin / (1 - e).
  //
  const a = options.minimalGalaxySeparation / (1 - options.eccentricity);

  // We want to start simulation when two cores are located at maximum distance
  // rMax from each other (a.k.a. apastron), which is given by equation:
  //
  //        rMax = a (1 + e)
  //
  const r = a * (1 + options.eccentricity);

  // Calculate the total mass of galaxy cores
  const totalMass = options.masses[0] + options.masses[1];


  // Positions of galaxy cores
  // --------

  var positions = [];

  // We have two galaxy cores. If we place the origin of coordinate system
  // at the center of their mass, positions are given by the equation:
  //
  //            r1 m1 = r2 m2,                  (1)
  //
  //    where
  //        r1, r2 are distances to the galaxy cores from the center of mass,
  //        m1, m2 are masses of the two cores.
  //
  // The distance r between the two cores is
  //
  //          r = r1 + r2.                       (2)
  //
  // Next, we solve Eq. 1 for r1:
  //
  //          r1 = m2 r2 / m1.
  //
  // Substituting r2 = r - r1 from Eq. 2 we get
  //
  //          r1 = m2 (r - r1) / m1
  //             = r m2 / m1 - m2 r1 / m1.
  //
  // Finally, we rearrange and find r1 distance:
  //
  //          r1 = (r m2 / m1) * ( 1 / (1 + m2 / m1)
  //             = r m2 / (m1 + m2)
  //
  // We use negative of that for the first core as its X coordinate:
  //
  positions.push([-r * options.masses[1] / totalMass, 0, 0]);

  // Similarly, we calculate the r2 distance:
  //
  //          r2 = r m1 / (m1 + m2)
  //
  positions.push([r * options.masses[0] / totalMass, 0, 0]);


  // Velocities of galaxy cores
  // --------

  var velocities = [];

  // In the coordinate system with the origin fixed at the first galaxy core,
  // the speed of the second core v0 is given by (from two-body problem):
  var v0 = Math.sqrt(a * (1 - Math.pow(options.eccentricity, 2) ) * totalMass) / r;

  // But our origin is located at the center of mass. Velocity vectors
  // of the two cores always point in the opposite directions. Therefore,
  // speed v0 of second core when viewed from the first core is
  //
  //            v0 = v1 + v2,
  //
  //        where
  //          v1, v2 are speeds of the two cores relative to the center of mass.
  //
  // Solving for v1 gives
  //
  //            v1 = v0 - v2.                   (3)
  //
  // Conservation of momentum gives
  //
  //            v1 m1 = v2 m2.
  //
  // Next, we solve for v2:
  //
  //            v2 = v1 m1 / m2
  //
  // and substitute v2 into Eq. 3:
  //
  //            v1 = v0 - v1 m1 / m2.
  //
  // Rearranging and solving for v1 gives:
  //
  //            v1 = v0 / (1 + m1 / m2)
  //               = v0 m2 / (m1 + m2)
  //
  velocities.push([0, -v0 * options.masses[1] / totalMass, 0]);

  // Similarly, we calculate the speed of the second core:
  //
  //            v2 = r m1 / (m1 + m2)
  velocities.push([0, v0 * options.masses[0] / totalMass, 0]);

  // Loop through galaxy cores
  for(let galaxyNumber = 0; galaxyNumber < 2; galaxyNumber++) {
    // Calculate positions and velocities of the stars the galaxy
    let galaxy = galaxyStarsPositionsAndVelocities(
      positions[galaxyNumber],
      velocities[galaxyNumber],
      options.masses[galaxyNumber],
      options.galaxyInclinationAngles[galaxyNumber],
      options.numberOfRings[galaxyNumber],
      options.ringSeparation
    );

    // Store positions and velocities of the stars
    positions = positions.concat(galaxy.positions);
    velocities = velocities.concat(galaxy.velocities);
  }

  return { positions, velocities };
}
