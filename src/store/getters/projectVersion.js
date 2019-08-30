import filters from '../shared/filters';
import editor from '../shared/editor';

function reduce (list) {
  return _.reduce(list, (memo, item) => { return Number(memo) + Number(item.estimate) }, 0);
}

export default {
  chapters (state) {
    return (entity) => {
      const { section, project } = state[entity];

      if (!project || !section) {
        return;
      }

      return {
        'user stories': editor.sections(project[0], section, 'user'),
        'technical stories': editor.sections(project[0], section, 'technical'),
        'estimates': [
          {
            id: 1,
            title: 'Priorities'
          },
          {
            id: 2,
            title: 'Labels'
          }
        ],
        'dictionary': filters.chapters(state[entity].dictionary)
        /*'': [{
          id: 3,
          title: 'Attachments'
        }]*/
      };
    };
  },

  section (state) {
    return (id, entity) => {
      const { section, story } = state[entity];
      const current = _.find(section, item => item.id === id);
      current.list = editor.stories(current.storyOrder, story);

      return current;
    };
  },

  sections (state) {
    return (type, entity) => {
      const sections = state[entity].section;
      const project = state[entity].project[0];

      return editor.sections(project, sections, type);
    };
  },

  summary (state, getters, rootState) {
    return (type, entity) => {
      const keys = type === 'labels' ? getters.labels(entity) : rootState.story[type];
      const stories = state[entity].story;
      let result = {};

      _.each(keys, (key, index) => {
        let filtered = _.filter(stories, story => {
          if (_.isArray(story[type])) {
            return story[type].includes(index);
          } else {
            return Number(story[type]) === Number(index);
          }
        });

        const property = _.isObject(key) ? key.name : key;

        result[property] = {
          estimate: reduce(filtered),
          colour: _.isObject(key) ? key.colour : '',
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
    return (entity) => {
      const dictionary = state[entity].dictionary;
      const chapters = filters.chapters(dictionary);

      return filters.volumns(dictionary, chapters);
    };
  },

  info (state) {
    return (entity) => {
      const info = state[entity];
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
    };
  },

  comment (state) {
    return state.projectVersion.comment;
  },

  labels (state) {
    return (entity) => {
      const phrases = state[entity].dictionary;
      return editor.labels(phrases);
    };
  }
};
