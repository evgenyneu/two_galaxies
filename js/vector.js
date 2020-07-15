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
 * @return {number} Dot product of thw two vectors
 */
export function dotProduct(a, b) {
  return a.reduce((r, a, i) => r + a * b[i], 0);
}


/**
 * Calculate length of a vector
 *
 * @param  {array} a Array of numbers
 * @return {number} Lelngth of vector a
 */
export function length(a) {
  return Math.sqrt(dotProduct(a, a));
}


/**
 * Multiply a vector by a number
 *
 * @param  {number} number A number
 * @param  {array} a An array of numbers
 * @return {array} Result of multiplying vector `a` by `number`.
 */
export function multiplyByNumber(number, a) {
  return a.map(item => number * item);
}
