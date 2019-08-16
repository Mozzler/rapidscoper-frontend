import filters from '../shared/filters';
import editor from '../shared/editor';

function reduce (list) {
  return _.reduce(list, (memo, item) => { return Number(memo) + Number(item.estimate) }, 0);
}

export default {
  chapters (state) {
    const { section, project } = state.projectVersion;

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
      'dictionary': filters.chapters(state.projectVersion.dictionary)
      /*'': [{
        id: 3,
        title: 'Attachments'
      }]*/
    };
  },

  section (state) {
    return id => {
      const { section, story } = state.projectVersion;
      const current = _.find(section, item => item.id === id);
      current.list = editor.stories(current.storyOrder, story);

      return current;
    };
  },

  sections (state) {
    return type => {
      const sections = state.projectVersion.section;
      const project = state.projectVersion.project[0];

      return editor.sections(project, sections, type);
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
    const dictionary = state.projectVersion.dictionary;
    const chapters = filters.chapters(dictionary);

    return filters.volumns(dictionary, chapters);
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
