// Get positions of stars from the physics simulation

import * as init from './simulation/initial_conditions.js';
import getAccelerations from './simulation/acceleration.js';
import integrateOneStep from './simulation/integrator.js';

export function setInitial(initialParams, currentParams) {
  var { positions, velocities } = init.allPositionsAndVelocities(initialParams);

  // Create an array to store accelerations, willed with zeros
  currentParams.accelerations = Array(positions.length).fill(0);

  getAccelerations(initialParams.masses, positions, currentParams.accelerations);

  currentParams.positions = positions;
  currentParams.velocities = velocities;
}

function fastForward(initialParams, currentParams) {
  var timeSteps = Math.round(Math.abs(currentParams.fastForwardSeconds *
                          currentParams.screenRefreshRateFPS));

  var timeDirection = Math.abs(currentParams.fastForwardSeconds) /
                        currentParams.fastForwardSeconds;

  for(let i = 0; i < timeSteps; i++) {
    var result = integrateOneStep(
      currentParams.timeStep * timeDirection,
      initialParams.masses,
      currentParams.positions,
      currentParams.velocities,
      currentParams.accelerations);

    currentParams.positions = result.positions;
    currentParams.velocities = result.velocities;
    currentParams.accelerations = result.accelerations;
  }
}

export function update(initialParams, currentParams) {
  if (currentParams.rotating) return;

  if (currentParams.fastForwardSeconds !== 0) {
    // We want to fast forward the simulation
    fastForward(initialParams, currentParams);
    currentParams.fastForwardSeconds = 0 ;
  }

  if (currentParams.paused) return;

  integrateOneStep(
    currentParams.timeStep * currentParams.timeDirection,
    initialParams.masses,
    currentParams.positions,
    currentParams.velocities,
    currentParams.accelerations);
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
