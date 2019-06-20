export default {
  createTeam (state, data) {
    state.teams = Object.assign(state.teams, data);
  }
};
