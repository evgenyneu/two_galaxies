import * as init from '../../../js/initial_conditions.js';
import getAccelerations from '../../../js/acceleration.js';
import integrateOneStep from '../../../js/integrator.js';

export function setInitial(initialParams, currentParams) {
  var { positions, velocities } = init.allPositionsAndVelocities(initialParams);

  currentParams.accelerations = getAccelerations(initialParams.masses,
                                                 positions);

  currentParams.positions = positions;
  currentParams.velocities = velocities;
}

export function update(timeStep, initialParams, currentParams) {
  if (currentParams.rotating) return;

  var result = integrateOneStep(
    timeStep,
    initialParams.masses,
    currentParams.positions,
    currentParams.velocities,
    currentParams.accelerations);

  currentParams.positions = result.positions;
  currentParams.velocities = result.velocities;
  currentParams.accelerations = result.accelerations;
}

/**
 * Calculate the time step given the screen refresh rate.
 * The point of this is to make the speed of the simulation independent
 * of refresh rate of the screen by using smaller time steps for higher
 * refresh rates.
 *
 * @param  {number} screenRefreshRateFPS Screen refresh rate (frames per second)
 * @param  {number} oneTimeStepFPS  Refresh rate corresponding to time step of one
 * @return {number} Time step
 */
export function calculateTimeStep(screenRefreshRateFPS, oneTimeStepFPS=60) {
  // Round refresh to first significant figure
  screenRefreshRateFPS = (Math.round(screenRefreshRateFPS / 10) * 10);

  return oneTimeStepFPS / screenRefreshRateFPS;
}
