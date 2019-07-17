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
  }
};
