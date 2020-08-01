// Calculate positions of stars using the physics simulation

import * as trajectories from './trajectories.js';
import * as init from './simulation/initial_conditions.js';
import getAccelerations from './simulation/acceleration.js';
import integrateOneStep from './simulation/integrator.js';


/**
 * Calculate initial positions of stars
 */
export function setInitial(initialParams, currentParams) {
  var { positions, velocities } = init.allPositionsAndVelocities(initialParams);

  currentParams.trajectoriesState = trajectories.init(positions);

  // Create an array to store accelerations, willed with zeros
  currentParams.accelerations = Array(positions.length).fill(0);

  getAccelerations(initialParams.masses, positions, currentParams.accelerations);

  currentParams.positions = positions;
  currentParams.velocities = velocities;
}


/**
 * Evolves the simulation by given number of seconds (fastForwardSeconds).
 */
function fastForward(initialParams, currentParams) {
  var timeSteps = Math.round(Math.abs(currentParams.fastForwardSeconds *
                          currentParams.screenRefreshRateFPS));

  var timeDirection = Math.abs(currentParams.fastForwardSeconds) /
                        currentParams.fastForwardSeconds;

  for(let i = 0; i < timeSteps; i++) {
    integrateOneStep(
      currentParams.timeStep * timeDirection,
      initialParams.masses,
      currentParams.positions,
      currentParams.velocities,
      currentParams.accelerations);

    trajectories.update(currentParams.trajectoriesState, currentParams.positions);
  }
}


/**
 * Evolves the simulation by one time step.
 */
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

  trajectories.update(currentParams.trajectoriesState, currentParams.positions);
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
