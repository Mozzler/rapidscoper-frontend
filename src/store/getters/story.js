function getConstructions () {
  return {
    'As a ...': {
      type: 'user',
      structure: '[beginning][actor][static-text="I can"][custom-1][static-text="so that"][custom-2]'
    },
    'Requires a ...': {
      type: 'requirement',
      structure: '[beginning][requirement][static-text="called"][field]'
    },
    'When I ...': {
      type: 'acceptance',
      structure: '[beginning][custom-1][static-text="then I"][custom-2]'
    }
  };
}

function findParent (data, parentStoryId) {
  return data.find(i => {
    if (i.id === parentStoryId) {
      return i;
    } else {
      if (i.list.length) {
        return findParent(i, parentStoryId);
      }
    }
  });
}

function createNode (entity, parent = null) {
  const constructions = getConstructions();
  const key = Object.keys(constructions).filter(k => {
    return constructions[k].type === entity.type;
  });

  return {
    id: entity.id,
    parent: parent,
    estimation: entity.estimate,
    priority: entity.priority,
    label: 1,
    parentStoryId: entity.parentStoryId,

    text: entity.markup,
    template: constructions[key].structure,
    tail: '',
    placeholder: entity.markup,
    parentId: entity.parentStoryId,
    storyOrder: entity.storyOrder,

    list: []
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
      const stories = _.filter(rootState.entity.story.items, item => item.sectionId === id);
      const items = [];

      _.each(stories, item => {
        let parent = null;
        let list = items;

        if (item.parentStoryId) {
          parent = findParent(items, item.parentStoryId);
          list = parent.list;
        }

        let node = createNode(item, parent);
        list.push(node);
      });

      return items;
    };
  }
};
