import editor from '../shared/editor';

export default {
  dictionary (state, getters, rootState) {
    const types = [
      'actor',
      'field',
      'requirement',
      'priority',
      'label',
      'model'
    ];

    const dictionary = {
      constructions: editor.constructions(),
      placeholders: {
        'actor': 'User Type',
        'requirement': 'Requirement Type',
        'field': 'Field'
      }
    };

    types.forEach(key => {
      dictionary[key] = [];
    });

    const phrases = rootState.entity.dictionary.items;
    phrases.forEach(item => {
      dictionary[item.type].push(item);
    });

    return dictionary;
  },

  content (state, getters, rootState) {
    return id => {
      // find current section by id
      const section = _.find(rootState.entity.section.items, item => item.id === id);
      // find stories of this section
      const stories = _.filter(rootState.entity.story.items, item => item.sectionId === id);
      // get dictionary words
      const dictionary = rootState.entity.dictionary.items;

      return editor.stories(section.storyOrder, stories, dictionary);
    };
  },

  orderedSections (state, getters, rootState) {
    return (id, type) => {
      const sections = rootState.entity.section.items;
      const project = _.find(rootState.entity.project.items, item => item.id === id);

      return editor.sections(project, sections, type);
    };
  },

  labels (state, getters, rootState) {
    const phrases = rootState.entity.dictionary.items;
    return editor.labels(phrases);
  },

  filters (state, getters, rootState) {
    return rootState.story.filters;
  },

  time (state, getters, rootState) {
    const filters = state.filters;
    if (!filters.priorities.length && !filters.labels.length && !filters.search) {
      return null;
    }

    let stories = rootState.entity.story.items;
    let lIds = [];
    let pIds = [];
    let sIds = [];

    if (filters.priorities.length) {
      lIds = _.chain(stories)
        .filter(item => filters.priorities.includes(item.priority))
        .map(item => item.id)
        .value();
    }

    if (filters.labels.length) {
      pIds = _.chain(stories)
        .filter(item => {
          let intersection = _.intersection(filters.labels, item.labels);
          return !!intersection.length;
        })
        .map(item => item.id)
        .value();
    }

    if (filters.search.length) {
      sIds = _.chain(stories)
        .filter(item => {
          let word = filters.search.toLowerCase();
          let markup = item.markup
            .replace(/<[^>]*>?/gm, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/  +/g, ' ')
            .toLowerCase();

          return markup.includes(word);
        })
        .map(item => item.id)
        .value();
    }

    let ids = [...lIds, ...pIds, ...sIds];
    return _.chain(stories)
      .filter(story => ids.includes(story.id))
      .reduce((memo, item) => Number(memo) + Number(item.estimate), 0)
      .value();
  }
};
