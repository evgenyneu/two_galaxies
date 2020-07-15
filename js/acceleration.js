import * as vector from '../js/vector.js';

export default function acceleration(number_of_galaxies, masses,
                                     positions, accelerations) {

  var displacement = [0, 0, 0];

  masses.forEach((mass, i) => {
    for (const j of Array(number_of_galaxies).keys()) {
      if (i == j) continue;

      displacement = vector.subtract(positions[i], positions[j]);

      // console.log(mass, i, j);
    }
  });

  return 1;
}
