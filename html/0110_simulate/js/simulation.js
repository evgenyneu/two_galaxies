import * as init from '../../../js/initial_conditions.js';

export function setInitial(initialParameters, currentParameters) {
  var { positions, velocities } =
    init.allPositionsAndVelocities(
      initialParameters.numberOfRings,
      initialParameters.ringSeparation,
      initialParameters.minimalGalaxySeparation,
      initialParameters.galaxyInclinationAngles,
      initialParameters.masses,
      initialParameters.eccentricity);
}
