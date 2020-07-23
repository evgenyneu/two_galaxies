/**
 * Measure refresh rate of the screen.
 *
 * Example
 * -------
 *
 * measureRefreshRate().then(fps => console.log(fps));
 *
 * @param  {type} tries=10 Number of animation frames called.
 *      Bigger number will result in more accurate measurement, but
 *      it will take longer to get it.
 *
 * @return {Promise} A promise object. Call .then((fps)=> ...) function
 *                   to get the refresh rate number.
 */
export default function measureRefreshRate(tries=10) {
  return new Promise(resolve => {
      requestAnimationFrame(storeFrameTime(tries, [], resolve));
    }
  );
}


/**
 * Measure the screen's refresh rate given the array of time stamps of each frame.
 *
 * @param  {array} measurements Array containing time stamps of each animation frame.
 * @return {number}            Refresh rate (frames per second)
 */
function measure(measurements) {
  var deltas = [];

  // Calculate the differences between time measurements
  for(let i = 0; i < measurements.length - 1; i++) {
    deltas.push(measurements[i + 1] - measurements[i]);
  }

  // Sort the time differences
  deltas = deltas.sort((a, b) => a - b);

  // Calculate the medium time difference
  let medium = deltas[Math.floor(measurements.length / 2)];
  return Math.round(1000 / medium);
}

/**
 * Stores time of the animation frame. The method is called multiple time
 * for each animation frame until the number of `tries` is exceeded.
 *
 * @param  {number} tries       Number of animation frames called.
 * @param  {array} measurements Array for storing the time stamps of each try.
 * @param  {function} resolve  Resolve method for the promise.
 */
function storeFrameTime(tries, measurements, resolve) {
  return (now) => {
    if (measurements.length < tries) {
      // Save the time fo the current frame
      measurements.push(now);

      // Call this function on the next frame
      requestAnimationFrame(storeFrameTime(tries, measurements, resolve));
    } else {
      // Number of tries is exceeded, measure FPS
      const fps = measure(measurements, resolve);

      // Resolve the promise
      resolve(fps);
    }
  };
}
