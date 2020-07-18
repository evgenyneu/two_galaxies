export default function integrateOneStep(timeStep, masses, positions,
                                         velocities) {
  var accelerations = 1;

  return { positions, velocities, accelerations };
}
