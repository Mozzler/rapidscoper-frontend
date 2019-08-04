function getConstructions () {
  return {
    'As a ...': {
      type: 'user',
      structure: '[beginning][actor][static-text="I can"][custom-1][static-text="so that"][custom-2]',
      limits: 'user-story'
    },
    'The system must ...': {
      type: 'technical',
      structure: '[beginning][custom-1]',
      limits: 'technical-story'
    },
    'Requires a ...': {
      type: 'requirement',
      structure: '[beginning][requirement][static-text="called"][field][custom-1]'
    },
    'When I ...': {
      type: 'acceptance',
      structure: '[beginning][custom-1][static-text="then I"][custom-2]'
    }
  };
}

function sortStoriesByOrder (list, order) {
  let data = [];

  _.each(order, orderId => {
    const story = list.find(story => story.id === orderId);
    if (!_.isUndefined(story)) {
      data.push(story);
    }
  });

  return data;
}

function getConstructionByType (type) {
  const constructions = getConstructions();

  const key = Object.keys(constructions).find(k => {
    return constructions[k].type === type;
  });

  return constructions[key];
}

// stupid code, but can't use recursion: leads to the
// 'Maximum call stack size exceeded error':
// vue watcher can't create the recursive references
function getStoryLevel (id, stories) {
  if (id === null) {
    return 0;
  }

  id = stories.find(item => item.id === id).parentStoryId;
  if (id === null) {
    return 1;
  }

  id = stories.find(item => item.id === id).parentStoryId;
  if (id === null) {
    return 2;
  }
}

function replaceMarkup (markup, dictionary) {
  const spans = markup.split('&nbsp;');

  _.each(spans, (item, index) => {
    const matched = item.match(/data-id="(.*?)"/);
    if (matched) {
      const dictionaryItem = _.find(dictionary, i => i.id === matched[1]);
      const replaceable = item.match(/>(.*?)(?=<\/span>)/)[1];

      spans[index] = item.replace(replaceable, dictionaryItem.name);
    }
  });

  return spans.join('&nbsp;');
}

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
      constructions: getConstructions(),
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

      // sort stories in accordance with storyOrder property
      const sorted = sortStoriesByOrder(stories, section.storyOrder);

      const dictionary = rootState.entity.dictionary.items;

      // format the response
      return _.map(sorted, item => {
        const basic = _.pick(item, 'id', 'parentStoryId',
          'sectionId', 'teamId', 'projectId',
          'estimate', 'priority', 'labels', 'markup',
          'type', 'level');
        const construction = getConstructionByType(basic.type);
        const markup = replaceMarkup(basic.markup, dictionary);

        return {
          ...basic,
          level: getStoryLevel(basic.parentStoryId, sorted),
          template: construction ? construction.structure : '',
          tail: '',
          markup: markup,
          placeholder: markup
        };
      });
    };
  },

  orderedSections (state, getters, rootState) {
    return (id, type) => {
      const sections = rootState.entity.section.items;
      const project = _.find(rootState.entity.project.items, item => item.id === id);

      const filteredOrder = [];

      _.each(project.sectionOrder, sectionId => {
        let found = _.find(sections, section => section.id === sectionId && section.type === type);
        if (found) {
          filteredOrder.push(found);
        }
      });

      return filteredOrder;
    };
  }
};
