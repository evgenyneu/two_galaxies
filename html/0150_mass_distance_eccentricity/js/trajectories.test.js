import { init } from './trajectories.js';

var expect = chai.expect;

describe('Trajectories', () => {
  it('Trajectories', () => {
    var positions = [1, 0, 0, -1, 0, 0];
    let size = 5;

    let result = init(positions, size);

    expect(result.points).to.equal(1);
    expect(result.trajectories[0].length).to.equal(15);
    expect(result.trajectories[1].length).to.equal(15);

    expect(result.trajectories[0].slice(0, 3)).to.deep.equal([1, 0, 0]);
    expect(result.trajectories[1].slice(0, 3)).to.deep.equal([-1, 0, 0]);
  });
});
