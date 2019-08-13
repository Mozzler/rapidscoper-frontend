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

      return list.length;
    };
  },
  projectsWithMembers (state) {
    /*let projects = [...state.project.items];
    let userProject = [...state.userProject.items];
    let userInfo = [...state.userInfo.items];

    return projects.map(item => {
      const obj = { ...item };

      const filtered = _.filter(userProject, user => user.projectId === item.id);
      const members = filtered.map(item => item.userId);
      console.log(_.first(members, 3));

      obj.members = _.chain(userProject)
        .filter(user => user.projectId === item.id)
        .map(user => user.userId)
        .first(3)
        .filter(id => userInfo.userId === id)
        .map(item => item.avatarUrl)
        .value();

      return obj;
    });*/

    return state.project.items;
  }
};
