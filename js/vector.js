/** Functions for working with vectors: subtract, dot product etc. */

/**
 * Calculates the difference of two vectors: a - b
 *
 * @param  {array} a Array of numbers
 * @param  {array} b Array of numbers
 * @return {array}  Difference of two vectors a - b
 */
export function subtract(a, b) {
  return a.map((item, i) => item - b[i]);
}


/**
 * Calculate dot product of two vectors
 *
 * @param  {array} a Array of numbers
 * @param  {array} b Array of numbers
 * @return {number} dot product of thw two vectors
 */
export function dotProduct(a, b) {
  return a.reduce((r, a, i) => r + a * b[i], 0);
}
