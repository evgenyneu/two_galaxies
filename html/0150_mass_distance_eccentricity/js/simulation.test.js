import { calculateTimeStep } from './simulation.js';

var expect = chai.expect;

describe('Simulation', () => {
  it('calculateTimeStep', () => {
    var screenRefreshRateFPS = 60;
    expect(calculateTimeStep(screenRefreshRateFPS)).to.equal(1);

    screenRefreshRateFPS = 144;
    expect(calculateTimeStep(screenRefreshRateFPS)).to.closeTo(0.4285, 1e-3);

    screenRefreshRateFPS = 144;
    var oneTimeStepFPS = 100;

    expect(calculateTimeStep(screenRefreshRateFPS, oneTimeStepFPS))
      .to.closeTo(0.7142, 1e-3);
  });
});
