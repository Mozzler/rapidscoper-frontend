export default {
  chapters (state, getters, rootState) {
    let sectionsByType = (type) => {
      return _.filter(state.projectVersion.section, item => item.type === type);
    };

    return {
      'user stories': sectionsByType('user'),
      'technical stories': sectionsByType('technical'),
      'summary': [
        {
          id: 1,
          title: 'Estimate for priorities'
        },
        {
          id: 2,
          title: 'Estimate for labels'
        }
      ],
      'dictionary': [],
      '': [{
        id: 3,
        title: 'Attachments'
      }]
    };
  },

  section (state, getters, rootState) {
    return id => {
      const section = _.find(state.projectVersion.section, item => item.id === id);
      section.list = _.filter(state.projectVersion.story, item => item.sectionId === id);

      return section;
    };
  },

  sections (state, getters, rootState) {
    return type => {
      const order = state.projectVersion.project[0].sectionOrder[type];
      return _.filter(state.projectVersion.section, item => order.includes(item.id));
    };
  },

  summary (state, getters, rootState) {
    return type => {
      const keys = rootState.story[type];
      const stories = state.projectVersion.story;
      let result = {
        total: 0
      };

      _.each(keys, (key, index) => {
        let filtered = _.filter(stories, story => Number(story[type]) === Number(index));
        console.log(filtered);

        result[key] = {
          estimate: _.reduce(filtered, (memo, item) => { return Number(memo) + Number(item.estimate) }, 0),
          index: index
        };
        result.total += result[key].estimate;
      });
      return result;
    };
  }
};
