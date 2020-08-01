import {
  getShareURL, filterInitialParams, filterCurrentParams,
  getUrlParameters, getInitialParameters,
  getInitialParametersFromUrl, getCurrentParametersFromUrl,
  readArrayOfFloats, readFloat,
  roundArray, roundFloat, roundN,
  prepareParamsForSharing
} from './share.js';

import m4 from './simulation/m4.js';

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

  it('returns URL parameters with rotation', () => {
    let initialParams = {
      numberOfRings: [3, 5],
      ringSeparation: 2.8
    };

    let currentParams = {
      rotationMatrix: [
         1.345678990,  0,  2,  0,
         0,  1.28345456,  0,  0,
         0,  0,  1.1,  0,
         0,  0,  0,  0.9,
      ]
    };

    let result = getUrlParameters(initialParams, currentParams);

    expect(result).to.equal("numberOfRings=3%2C5&ringSeparation=2.8\
&rotationMatrix=1.35%2C0%2C2%2C0%2C0%2C1.28%2C0%2C0%2C0%2C0%2C1.1%2C0%2C0%2C0%2C0%2C0.9");
  });

  it('ignore unknown parameters', () => {
    let initialParams = {
      numberOfRings: [3, 5],
      ringSeparation: 2.8,
      unknown: 23
    };

    let currentParams = { unknownTwo: 2 };

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

describe('filterCurrentParams', () => {
  it('keeps only permitted parameters', () => {
    let currentParams = {
      rotationMatrix: [
         1.3,  0,  2,  0,
         0,  1.2,  0,  0,
         0,  0,  1.1,  0,
         0,  0,  0,  0.9,
      ],
      unknown: 23
    };

    let result = filterCurrentParams(currentParams);

    expect(result).to.have.property('rotationMatrix');
    expect(result).not.to.have.property('unknown');
  });
});

describe('getInitialParametersFromUrl', () => {
  it('load initial parameters from URL', () => {
    let initialParams = {
      numberOfRings: [5, 6],
      ringSeparation: 8,
      another: 23
    };

    let urlParams = "?numberOfRings=3.3%2C5&ringSeparation=2.8";
    let result = getInitialParametersFromUrl(urlParams, initialParams);

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
    let result = getInitialParametersFromUrl(urlParams, initialParams);

    expect(result.ringSeparation).to.equal(8);
    expect(result.numberOfRings).to.deep.equal([5, 6]);
    expect(result.another).to.equal(23);
  });
});

describe('getCurrentParametersFromUrl', () => {
  it('load current parameters from URL', () => {
    let currentParams = {
      rotationMatrix: m4.identity(),
      another: 23
    };

    let urlParams = "?rotationMatrix=1.2%2C0%2C0%2C0%2C0%2C1.3%2C0%2C0%2C0%2C0%2C1%2C0%2C0%2C0%2C0.9%2C1";
    let result = getCurrentParametersFromUrl(urlParams, currentParams);

    console.log(result.rotationMatrix);

    expect(result.rotationMatrix).to.deep.closeTo([
       1.2,  0,  0,  0,
       0,  1.3,  0,  0,
       0,  0,    1,  0,
       0,  0,  0.9,  1
    ], 1e-13);

    expect(result.another).to.equal(23);

    // Keep default unchanged
    expect(currentParams.rotationMatrix).to.deep.equal(m4.identity());
    expect(currentParams.another).to.equal(23);
  });

  it('used default when empty', () => {
    let currentParams = {
      rotationMatrix: m4.identity(),
      another: 23
    };

    let urlParams = "?rotationMatrix=";
    let result = getCurrentParametersFromUrl(urlParams, currentParams);

    expect(result.rotationMatrix).to.deep.equal(m4.identity());
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

it('roundN', () => {
  expect(roundN(1.356234, 0)).to.equal(1);
  expect(roundN(1.356234, 1)).to.equal(1.4);
  expect(roundN(1.356234, 2)).to.equal(1.36);
  expect(roundN(1.356234, 3)).to.equal(1.356);
  expect(roundN(0, 2)).to.equal(0);
  expect(roundN(1.000001, 2)).to.equal(1);
  expect(roundN(-1.2134, 2)).to.equal(-1.21);
});

describe('roundFloat', () => {
  it('round', () => {
    let fn = roundFloat(2);
    let result = fn(1.345);

    expect(result).to.deep.equal(1.35);
  });
});


describe('roundArray', () => {
  it('round', () => {
    let fn = roundArray(2);
    let result = fn([1.234567, 2.6789012345]);

    expect(result).to.deep.equal([1.23, 2.68]);
  });
});

describe('prepareParamsForSharing', () => {
  it('rounds values in the array', () => {
    let params = {
      "name": [1.234567, 2.345]
    };

    let sharedParams = {
      "name": {
        storeFunction: roundArray(2)
      }
    };

    let result = prepareParamsForSharing(params, sharedParams);

    expect(result.name).to.deep.equal([1.23, 2.35]);

    // Input is unchanged
    expect(params.name).to.deep.equal([1.234567, 2.345]);
  });
});
