import { getShareURL, filterInitialParams, getUrlParameters } from './share.js';

var expect = chai.expect;

describe('getUrlParameters', () => {
  it('returns URL parameters', () => {
    let initialParams = {
      numberOfRings: [3, 5],
      ringSeparation: 2.8
    };

    let currentParams = {};

    let result = getUrlParameters(initialParams, currentParams);

    expect(result).to.equal("numberOfRings=3%2C5&ringSeparation=2.8");
  });

  it('ingnore unknown parameters', () => {
    let initialParams = {
      numberOfRings: [3, 5],
      ringSeparation: 2.8,
      unknown: 23
    };

    let currentParams = {};

    let result = getUrlParameters(initialParams, currentParams);

    expect(result).to.equal("numberOfRings=3%2C5&ringSeparation=2.8");
  });
});

describe('getShareURL', () => {
  it('returns URL for sharing', () => {
    let initialParams = {
      numberOfRings: [3, 5],
      ringSeparation: 2.8
    };

    let currentParams = {};

    let result = getShareURL(initialParams, currentParams);

    expect(result).to.include("://");
    expect(result).to.include("?numberOfRings=3%2C5&ringSeparation=2.8");
  });
});

describe('filterInitialParams', () => {
  it('keeps only permitted parameters', () => {
    let initialParams = {
      numberOfRings: [3, 5],
      ringSeparation: 2.8,
      unknown: 23
    };

    let result = filterInitialParams(initialParams);

    expect(result).to.have.property('numberOfRings');
    expect(result).to.have.property('ringSeparation');
    expect(result).not.to.have.property('unknown');
  });
});
