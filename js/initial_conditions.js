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
 * Calculate positions and velocities of stars located in rings around
 * a single galaxy core.
  *
  * @param  {array} corePosition  Position of the core
  * @param  {array} coreVelocity  Core velocity
  * @param  {number} coreMass     Mass of the core
  * @param  {number} theta        Inclanation angle of the galaxy relative
  *                               to the orbital plane of the core
  * @param  {number} numberOfRings Number of rings in the galaxy
  * @param  {number} ringSeparation Separation between two rings
  * @return {object} An object { positions: [...], velocities: [...] }
  *                  containing positions and velocities of all stars in the
  *                  galaxy.
  */
export function addGalaxy(corePosition, coreVelocity, coreMass, theta, numberOfRings, ringSeparation) {

  var positions = [];
  var velocities = [];

  for(let ringNumber = 1; ringNumber <= numberOfRings; ringNumber++) {
    let distanceFromCenter = ringNumber * ringSeparation;
    let numberOfStars = numberOfStarsInOneRing(ringNumber);
    let vPhi = Math.sqrt(coreMass / distanceFromCenter);
    let angleBetweenNeighbours = 2 * Math.PI / numberOfStars;

    for(let starNumber = 1; starNumber <= numberOfStars; starNumber++) {
      let phi = (starNumber - 1) * angleBetweenNeighbours;

      var position = vector.add(corePosition, [
        distanceFromCenter * Math.cos(phi) * Math.cos(theta),
        distanceFromCenter * Math.sin(phi),
        -distanceFromCenter * Math.cos(phi) * Math.sin(theta)
      ]);

      positions.push(position);

      var velocity = vector.add(coreVelocity, [
        -vPhi * Math.sin(phi) * Math.cos(theta),
        vPhi * Math.cos(phi),
        vPhi * Math.sin(phi) * Math.sin(theta)
      ]);

      velocities.push(velocity);
    }
  }

  return { positions, velocities };
}
