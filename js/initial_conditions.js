
/**
 * Calculate the number of stars in a single ring of a galaxy
 *
 * @param  {number} ringNumber The ring number: 1, 2, 3...
 *    The ring number 1 is the closest ring to the center of the galaxy.
 * @return {number} Number of stars in the ring.
 */
export function numberOfStarsInOneRing(ringNumber) {
  return 12 + 6 * (ringNumber - 1);
}
