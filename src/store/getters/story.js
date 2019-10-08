import editor from '../shared/editor';

function matches (stories) {
  return (ids, cb = null, internal) => {
    if (cb) {
      internal = _.chain(stories)
        .filter(cb)
        .map(item => item.id)
        .value();
    }

    if (ids.length) {
      return _.intersection(ids, internal);
    }

    return internal;
  };
}

export default {
  dictionary (state, getters, rootState) {
    const types = [
      'actor',
      'field',
      'requirement',
      'priority',
      'label',
      'model',
      'custom'
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
      // get filters
      const filters = rootState.story.filters;
      // get comments
      const comments = rootState.entity.comment.items;

      return editor.stories(section.storyOrder, stories, comments, dictionary, filters);
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

  matches (state, getters, rootState) {
    let filters = state.filters;
    let stories = rootState.entity.story.items;

    return _.chain(stories)
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
  },

  time (state, getters, rootState) {
    const filters = state.filters;
    if (!filters.priorities.length && !filters.labels.length && !filters.search) {
      return null;
    }

    let ids = [];
    let stories = rootState.entity.story.items;
    let f = matches(stories, ids);

    if (filters.priorities.length) {
      ids = f(ids, item => filters.priorities.includes(item.priority));
    }

    if (filters.labels.length) {
      ids = f(ids, item => _.intersection(filters.labels, item.labels).length);
    }

    if (filters.search.length) {
      ids = f(ids, null, getters.matches);
    }

    return _.chain(stories)
      .filter(story => ids.includes(story.id))
      .reduce((memo, item) => Number(memo) + Number(item.estimate), 0)
      .value();
  },

  identifier (state, getters, rootState) {
    return type => {
      let stories = rootState.entity.story.items;
      let max = _.chain(stories)
        .map(item => {
          let id = item.storyIdentifier.replace(/\D/g, '');
          return Number(id);
        })
        .max()
        .value();

      let letter = type.charAt(0).toUpperCase();
      let number = (max + 1).toString();
      let zeros = '';

      for (let i = number.length; i < 3; i++) {
        zeros += '0';
      }

      return `${letter}${zeros}${number}`;
    };
  }
};
