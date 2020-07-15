import * as vector from '../js/vector.js';

export default function getAcceleration(number_of_galaxies, masses,
                                     positions) {

  var displacement = [0, 0, 0];
  var accelerations = Array.from(Array(positions.length)).map(_ => [0, 0, 0]);

  masses.forEach((mass, i) => {
    for (const j of Array(number_of_galaxies).keys()) {
      if (i == j) continue;

      displacement = vector.subtract(positions[i], positions[j]);
      let distance = vector.length(displacement);
      console.log(masses[j], displacement, Math.pow(distance, 3));

      var a = vector.multiplyByNumber(masses[j] / Math.pow(distance, 3),
                                      displacement);

      accelerations[i] = vector.subtract(accelerations[i], a);
    }
  });

  return accelerations;
}
