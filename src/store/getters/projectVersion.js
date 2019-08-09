import filters from '../shared/filters';
import editor from "../shared/editor";

function reduce (list) {
  return _.reduce(list, (memo, item) => { return Number(memo) + Number(item.estimate) }, 0);
}

export default {
  chapters (state) {
    const { section, project } = state.projectVersion;

    return {
      'user stories': editor.sections(project[0], section, 'user'),
      'technical stories': editor.sections(project[0], section, 'technical'),
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
      'dictionary': filters.chapters(state.projectVersion.dictionary)
      /*'': [{
        id: 3,
        title: 'Attachments'
      }]*/
    };
  },

  section (state) {
    return id => {
      const section = _.find(state.projectVersion.section, item => item.id === id);
      section.list = _.filter(state.projectVersion.story, item => item.sectionId === id);

      return section;
    };
  },

  sections (state) {
    return type => {
      const order = state.projectVersion.project[0].sectionOrder[type];
      return _.filter(state.projectVersion.section, item => order.includes(item.id));
    };
  },

  summary (state, getters, rootState) {
    return type => {
      const keys = rootState.story[type];
      const stories = state.projectVersion.story;
      let result = {};

      _.each(keys, (key, index) => {
        let filtered = _.filter(stories, story => {
          if (_.isArray(story[type])) {
            return story[type].includes(index);
          } else {
            return Number(story[type]) === Number(index);
          }
        });

        result[key] = {
          estimate: reduce(filtered),
          index: index
        };
      });

      result['Total'] = {
        estimate: reduce(result)
      };

      return result;
    };
  },

  dictionary (state) {
    const sections = filters.chapters(state.projectVersion.section);
    return filters.volumns(state.projectVersion.dictionary, sections);
  },

  info (state) {
    const info = state.projectVersion;
    let created = null;

    if (info && info.projectShare) {
      let unix = moment.unix(info.projectShare[0].createdAt);
      created = unix.format("MMMM DD, YYYY hh:mm A");
    }

    return {
      projectName: info && info.project ? info.project[0].name : null,
      version: info && info.projectShare ? info.projectShare[0].versionNumber : null,
      created: created
    };
  },

  comment (state) {
    return state.projectVersion.comment;
  }
};
