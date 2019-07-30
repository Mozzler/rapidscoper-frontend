function getConstructions () {
  return {
    'As a ...': {
      type: 'user',
      structure: '[beginning][actor][static-text="I can"][custom-1][static-text="so that"][custom-2]',
      limits: 'user-story'
    },
    'Requires a ...': {
      type: 'requirement',
      structure: '[beginning][requirement][static-text="called"][field][custom-1]'
    },
    'When I ...': {
      type: 'acceptance',
      structure: '[beginning][custom-1][static-text="then I"][custom-2]'
    },
    'The system must ...': {
      type: 'technical',
      structure: '[beginning][custom-1]',
      limits: 'technical-story'
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
// 'Maximum call stack size exceeded error'
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

      // format the response
      return _.map(sorted, item => {
        const basic = _.pick(item, 'id', 'parentStoryId',
          'sectionId', 'teamId', 'projectId',
          'estimate', 'priority', 'labels', 'markup',
          'type', 'level');
        const construction = getConstructionByType(basic.type);

        return {
          ...basic,
          level: getStoryLevel(basic.parentStoryId, sorted),
          template: construction ? construction.structure : '',
          tail: '',
          placeholder: basic.markup
        };
      });
    };
  }
};
