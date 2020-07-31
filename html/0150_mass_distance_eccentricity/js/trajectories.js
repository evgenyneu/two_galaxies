export function init(positions, size=100) {
  let trajectories1 = Array(size * 3).fill(0);
  let trajectories2 = Array(size * 3).fill(0);

  // Store positions of the two galaxy cores
  // ------

  trajectories1[0] = positions[0];
  trajectories1[1] = positions[1];
  trajectories1[2] = positions[2];

  trajectories2[0] = positions[3];
  trajectories2[1] = positions[4];
  trajectories2[2] = positions[5];

  let state = {
    trajectories: [trajectories1, trajectories2],
    // Number of positions for each galaxy core stored in `trajectories`
    points: 1
  };

  return state;
}

export function update(state, positions) {
  if (state.point == state.trajectories[0].length / 3) {
    // Arrays are full, remove the first positions to make room for the new ones
    state.trajectories[0].shift();
    state.trajectories[1].shift();
    state.points -= 1;
  }

  // Store positions of the two galaxy cores
  // ------

  state.trajectories[0][state.points * 3] = positions[0];
  state.trajectories[0][state.points * 3 + 1] = positions[1];
  state.trajectories[0][state.points * 3 + 2] = positions[2];

  state.trajectories[1][state.points * 3] = positions[3];
  state.trajectories[1][state.points * 3 + 1] = positions[4];
  state.trajectories[1][state.points * 3 + 2] = positions[5];

  state.points += 1;

  return state;
}
