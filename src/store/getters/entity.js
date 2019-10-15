import editor from '../shared/editor';

function uppercased (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function detectRelatedUsers (info, roles) {
  return (collection, team = false) => _.map(collection, item => {
    let data = {
      id: item.id,
      role: _.find(roles, role => item.role === role.type),
      email: item.email,
      teammate: team
    };

    let user = _.find(info, inf => inf.userId === item.userId);
    if (user) {
      data.email = user.email;
      data.avatarUrl = user.avatarUrl ? user.avatarUrl :
        require('@/assets/img/default-user.png');
    }

    return data;
  });
}

export default {
  items (state, getters, rootState) {
    return entity => {
      const items = state[entity].items;
      const roles = rootState.system.roles;
      const invites = rootState.system.invites;
      let data = [];

      if (entity === 'userTeam') {
        _.each(items, item => {
          const value = { ...item };
          value.role = _.find(roles, item => item.type === value.role);
          console.log(invites);
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
  projectsWithMembers (state, getters, rootState) {
    return teamId => {

      let projects = [...state.project.items];
      let userProject = [...state.userProject.items];
      let userInfo = [...state.userInfo.items];
      let user = rootState.auth.user;

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

        const up = _.find(userProject, u =>
          u.userId === user.user_id && u.projectId === item.id);

        if (up) {
          obj.role = up.role;
        }

        return obj;
      });
    };
  },
  invited (state, getters, rootState) {
    const detect = detectRelatedUsers(state.userInfo.items, rootState.system.roles);

    return [
      ...detect(state.invite.items),
      ...detect(state.userTeam.items, true)
    ];
  },
  link (state, getters, rootState, rootGetters) {
    return projectId => {
      let items = rootState.entity.projectShare.items;
      let shared = _.find(items, item =>
        item.projectId === projectId &&
        item.status === 'active');

      let roles = rootState.system.roles;
      let periods = rootGetters['system/periods'];

      if (shared) {
        shared = { ...shared };
        shared.role = _.find(roles, role => shared.role === role.type);
        shared.expiry = _.find(periods, period => shared.expiry === period.type);
      }

      return shared;
    };
  },
  comments (state) {
    return () => {
      let comment = state.comment;
      let userInfo = state.userInfo;

      return editor.comments(comment.items, userInfo.items);
    };
  },
  allowedRoles (state, getters, rootState) {
    return (entityId, entityType = 'project') => {
      const entity = `user${entityType.charAt(0).toUpperCase()}${entityType.slice(1)}`;
      const collection = rootState.entity[entity].items;
      const user = rootState.auth.user;
      const roles = rootState.system.roles;

      const authorizedUser = _.find(collection, item => {
        return (item.userId === user.user_id && entityId === item[`${entityType}Id`]);
      });

      let acceptableIndex = authorizedUser ? _.findIndex(roles, { type: authorizedUser.role }) : -1;
      return _.filter(roles, (role, index) => index >= acceptableIndex);
    };
  }
};
