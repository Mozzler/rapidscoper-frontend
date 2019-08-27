function uppercased (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default {
  items (state) {
    return entity => {
      let items = state[entity].items;
      let data = [];

      if (entity === 'userTeam') {
        _.each(items, item => {
          const value = { ...item };
          value.role = uppercased(item.role);
          data.push(value);
        });
      } else {
        data = state[entity].items;
      }

      return data;
    };
  },
  total (state) {
    return (entity, f = null) => {
      let list = state[entity].items;

      if (f) {
        list = list.filter(item => f(item));
      }

      return list.length.toString();
    };
  },
  projectsWithMembers (state) {
    return teamId => {

      let projects = [...state.project.items];
      let userProject = [...state.userProject.items];
      let userInfo = [...state.userInfo.items];

      if (teamId) {
        projects = _.filter(projects, item => item.teamId === teamId);
      }

      return projects.map(item => {
        const obj = { ...item };

        let three = _.chain(userProject)
          .filter(user => user.projectId === item.id)
          .map(v => v.userId)
          .first(3)
          .value();

        obj.members = _.map(three, id => {
          let found = _.find(userInfo, info => info.userId === id);
          return found ? found.avatarUrl : null;
        });

        return obj;
      });
    };
  },
  invited (state, getters, rootState) {
    const invite = rootState.entity.invite.items;
    const info = rootState.entity.userInfo.items;

    return _.map(invite, item => {
      let data = {
        id: item.id,
        role: uppercased(item.role),
        email: item.email
      };

      let user = _.find(info, inf => inf.email === item.email);
      data.avatarUrl = user && user.avatarUrl ? user.avatarUrl :
        require('@/assets/img/default-user.png');

      return data;
    });
  }
};
