import * as init from '../js/initial_conditions.js';

var expect = chai.expect;

describe('Initial conditions', () => {
  it('numberOfStarsInOneRing', () => {
    expect(init.numberOfStarsInOneRing(1)).to.equal(12);
    expect(init.numberOfStarsInOneRing(2)).to.equal(18);
    expect(init.numberOfStarsInOneRing(3)).to.equal(24);
  });

  it('numberOfStarsInAllRingsOneGalaxy', () => {
    expect(init.numberOfStarsInAllRingsOneGalaxy(5)).to.equal(120);
  });

  it('galaxyStarsPositionsAndVelocities', () => {
    const corePosition = [1, 0, 0];
    const coreVelocity = [0, 1, 0];
    const coreMass = 1;
    const theta = 0.1;
    const numberOfRings = 5;
    const ringSeparation = 3;

    var { positions, velocities } = init.galaxyStarsPositionsAndVelocities(
      corePosition,
      coreVelocity,
      coreMass,
      theta,
      numberOfRings,
      ringSeparation
    );

    // Positions
    // --------

    expect(positions.length).to.equal(120);

    expect(positions[0]).to.deep.closeTo(
      [3.985012495834077, 0, -0.29950024994048446], 1e-13);

    expect(positions[1]).to.deep.closeTo(
      [3.5850966520063019, 1.5, -0.25937482488824837], 1e-13);

    expect(positions[119]).to.deep.closeTo(
      [15.698317243678604, -2.6047226650039557, -1.4747508408524161], 1e-13);

    // Velocities
    // --------

    expect(velocities.length).to.equal(120);

    expect(velocities[0]).to.deep.closeTo(
      [0, 1.5773502691896257, 0], 1e-10);

    expect(velocities[1]).to.deep.closeTo(
      [-0.2872329613340334, 1.5, 0.028819424987583143], 1e-13);

    expect(velocities[119]).to.deep.closeTo(
      [0.044611774600251820, 1.2542762684421485, -0.44761077756662986e-2], 1e-13);
  });
});
