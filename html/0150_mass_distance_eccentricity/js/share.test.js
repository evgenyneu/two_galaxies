import { getShareURL } from './share.js';

var expect = chai.expect;

describe('getShareURL', () => {
  it('hi', () => {
    let result = getShareURL({}, {});

    expect(result).to.equal("Hello");
  });
});
