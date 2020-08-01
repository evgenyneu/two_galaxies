import { init, update } from './trajectories.js';

var expect = chai.expect;

describe('Trajectories', () => {
  it('init', () => {
    var positions = [1, 0, 0, -1, 0, 0];
    let size = 5;

    let result = init(positions, size);

    expect(result.points).to.equal(1);
    expect(result.trajectories[0].length).to.equal(15);
    expect(result.trajectories[1].length).to.equal(15);

    expect(result.trajectories[0].slice(0, 3)).to.deep.equal([1, 0, 0]);
    expect(result.trajectories[1].slice(0, 3)).to.deep.equal([-1, 0, 0]);
  });

  it('update', () => {
    var positions = [2, 1, -1, 3, 5, 3];

    let size = 5;
    let state = init(positions, size);
    let result = update(state, positions);

    expect(result.points).to.equal(2);
    expect(result.trajectories[0].length).to.equal(15);
    expect(result.trajectories[1].length).to.equal(15);

    expect(result.trajectories[0].slice(3, 6)).to.deep.equal([2, 1, -1]);
    expect(result.trajectories[1].slice(3, 6)).to.deep.equal([3, 5, 3]);
  });

  it('update multiple times', () => {
    let size = 5;
    var positions = [2, 1, -1, 3, 5, 3];
    let state = init(positions, size);

    for (let i = 0; i < 6; i++) {
      let positions = [2 + i, 1 + i, -1 + i, 3 + i, 5 + i, 3 + i];
      update(state, positions);
    }

    expect(state.points).to.equal(5);
    expect(state.trajectories[0].length).to.equal(15);
    expect(state.trajectories[1].length).to.equal(15);

    expect(state.trajectories[0].slice(3, 6)).to.deep.equal([4, 3, 1]);
    expect(state.trajectories[1].slice(3, 6)).to.deep.equal([5, 7, 5]);
  });
});
