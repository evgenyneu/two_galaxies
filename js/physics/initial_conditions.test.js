import * as init from './initial_conditions.js';

var expect = chai.expect;

describe('Initial conditions', () => {
  it('numberOfStarsInOneRing', () => {
    let multiplier = 6;
    expect(init.numberOfStarsInOneRing(1, multiplier)).to.equal(6);
    expect(init.numberOfStarsInOneRing(2, multiplier)).to.equal(12);
    expect(init.numberOfStarsInOneRing(3, multiplier)).to.equal(18);
  });

  it('numberOfStarsInAllRingsOneGalaxy', () => {
    let multiplier = 8;
    expect(init.numberOfStarsInAllRingsOneGalaxy(5, multiplier)).to.equal(120);
  });

  it('totalNumberOfBodies', () => {
    let multiplier = 8;
    expect(init.totalNumberOfBodies(3, 8, multiplier)).to.equal(338);
  });

  it('galaxyStarsPositionsAndVelocities', () => {
    const args = {
      corePosition: [1, 0, 0],
      coreVelocity: [0, 1, 0],
      coreMass: 1,
      galaxyAngleDegree: 0.1 * 180 / Math.PI,
      numberOfRings: 5,
      ringSeparation: 3,
      ringMultiplier: 8
    };

    var { positions, velocities } = init.galaxyStarsPositionsAndVelocities(args);

    // Positions
    // --------

    expect(positions.length).to.equal(360);

    expect(positions.slice(0, 3)).to.deep.closeTo(
      [3.985012495834077, 0, -0.29950024994048446], 1e-13);

    expect(positions.slice(3, 6)).to.deep.closeTo(
      [3.110722577730857, 2.1213203435596424, -0.21177865769998247], 1e-13);

    expect(positions.slice(3*119, 3*119 + 3)).to.deep.closeTo(
      [15.741310193330548, -2.3465169756034667, -1.4790645243577303], 1e-13);


    // Velocities
    // --------

    expect(velocities.length).to.equal(360);

    expect(velocities.slice(0, 3)).to.deep.closeTo(
      [0, 1.5773502691896257, 0], 1e-10);

    expect(velocities.slice(3, 6)).to.deep.closeTo(
      [-0.40620874947917696, 1.4082482904638631, 0.04075682167723415], 1e-13);

    expect(velocities.slice(119 * 3, 119 * 3 + 3)).to.deep.closeTo(
      [0.040189417406220285, 1.2550200329578804, -0.004032392016758411], 1e-13);
  });

  it('allPositionsAndVelocities', () => {
    const args = {
      numberOfRings: [5, 5],
      ringSeparation: 3,
      ringMultiplier: 8,
      minimalGalaxySeparation: 3,
      galaxyInclinationAnglesDegree: [0.123 * 180 / Math.PI, 0.123 * 180 / Math.PI],
      masses: [1, 0.7],
      eccentricity: 0.3
    };

    var { positions, velocities } = init.allPositionsAndVelocities(args);

    // Positions
    // --------

    // Two cores plus 120 stars in each galaxies
    expect(positions.length).to.equal(726);

    // Core 1
    expect(Array.from(positions.slice(0, 3))).to.deep.closeTo(
      [-2.2941176470588234, 0, 0], 1e-13);

    // Core 2
    expect(positions.slice(3, 6)).to.deep.closeTo(
      [3.2773109243697478, 0, 0], 1e-13);

    // Last star
    expect(positions.slice(241 * 3, 241 * 3 + 3)).to.deep.closeTo(
      [17.980706728192207, -2.3465169756034667, -1.8176935713537608], 1e-13);


    // Velocities
    // --------

    // Two cores plus 120 stars in each galaxies
    expect(velocities.length).to.equal(726);

    // Core 1
    expect(velocities.slice(0, 3)).to.deep.closeTo(
      [0, -0.19030023115825126, 0], 1e-13);

    // Core 2
    expect(velocities.slice(3, 6)).to.deep.closeTo(
      [0, 0.2718574730832161, 0], 1e-13);

    // Last star
    expect(velocities.slice(241 * 3, 241 * 3 + 3)).to.deep.closeTo(
      [0.033538396438367514, 0.4852225406244772, -0.004146152930446584], 1e-13);
  });
});
