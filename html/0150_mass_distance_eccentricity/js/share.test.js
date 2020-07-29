import { getShareURL, filterInitialParams, getUrlParameters,
         getInitialParameters, getInitialParameterFromUrl,
         readArrayOfFloats, readFloat } from './share.js';

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

describe('getInitialParameterFromUrl', () => {
  it('load initial parameters from URL', () => {
    let initialParams = {
      numberOfRings: [5, 6],
      ringSeparation: 8,
      another: 23
    };

    let urlParams = "?numberOfRings=3%2C5&ringSeparation=2.8";
    let result = getInitialParameterFromUrl(urlParams, initialParams);

    expect(result.ringSeparation).to.equal(2.8);
    expect(result.numberOfRings).to.deep.equal([3, 5]);
    expect(result.another).to.equal(23);

    // Keep default unchanged
    expect(initialParams.ringSeparation).to.equal(8);
    expect(initialParams.numberOfRings).to.deep.equal([5, 6]);
  });

  it('used default when empty', () => {
    let initialParams = {
      numberOfRings: [5, 6],
      ringSeparation: 8,
      another: 23
    };

    let urlParams = "?numberOfRings=&ringSeparation=";
    let result = getInitialParameterFromUrl(urlParams, initialParams);

    expect(result.ringSeparation).to.equal(8);
    expect(result.numberOfRings).to.deep.equal([5, 6]);
    expect(result.another).to.equal(23);
  });
});

describe('readFloat', () => {
  it('parse', () => {
    let result = readFloat("2.2");

    expect(result).to.equal(2.2);
  });

  it('parse invalid', () => {
    let result = readFloat("sdfd");

    expect(result).to.equal(null);
  });
});

describe('readArrayOfFloats', () => {
  it('parse', () => {
    let result = readArrayOfFloats("2.2,5");

    expect(result).to.deep.equal([2.2, 5]);
  });

  it('parse invalid', () => {
    let result = readArrayOfFloats("sdfd,fdgf");

    expect(result).to.deep.equal(null);
  });
});
