import * as init from './initial_conditions.js';

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
    const args = {
      corePosition: [1, 0, 0],
      coreVelocity: [0, 1, 0],
      coreMass: 1,
      galaxyAngle: 0.1,
      numberOfRings: 5,
      ringSeparation: 3
    };

    var { positions, velocities } = init.galaxyStarsPositionsAndVelocities(args);

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

  it('allPositionsAndVelocities', () => {
    const args = {
      numberOfRings: [5, 5],
      ringSeparation: 3,
      minimalGalaxySeparation: 3,
      galaxyInclinationAngles: [0.123, 0.123],
      masses: [1, 0.7],
      eccentricity: 0.3
    };

    var { positions, velocities } = init.allPositionsAndVelocities(args);

    // Positions
    // --------

    // Two cores plus 120 stars in each galaxies
    expect(positions.length).to.equal(242);

    // Core 1
    expect(positions[0]).to.deep.closeTo(
      [-2.2941176470588234, 0, 0], 1e-13);

    // Core 2
    expect(positions[1]).to.deep.closeTo(
      [3.2773109243697478, 0, 0], 1e-13);

    // Last star
    expect(positions[241]).to.deep.closeTo(
      [17.937824355647578, -2.6047226650039557, -1.8123922781056725], 1e-13);


    // Velocities
    // --------

    // Two cores plus 120 stars in each galaxies
    expect(velocities.length).to.equal(242);

    // Core 1
    expect(velocities[0]).to.deep.closeTo(
      [0, -0.19030023115825126, 0], 1e-13);

    // Core 2
    expect(velocities[1]).to.deep.closeTo(
      [0, 0.2718574730832161, 0], 1e-13);

    // Last star
    expect(velocities[241]).to.deep.closeTo(
      [0.03722888956660431, 0.48460026258500988, -0.0046023866960218348], 1e-13);
  });
});
