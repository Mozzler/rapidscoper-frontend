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
        return findParent(i.list, parentStoryId);
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
    parentStoryId: parent ? parent.id : null,

    estimation: entity.estimate,
    priority: entity.priority,
    label: 1,
    type: constructions[key].type,

    text: entity.markup,
    template: constructions[key].structure,
    tail: '',
    placeholder: entity.markup,

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
      const stories = _.chain(rootState.entity.story.items)
        .filter(item => item.sectionId === id)
        .sortBy(item => item.parentStoryId || '')
        .value();

      let items = [];

      _.each(stories, item => {
        let parent = null;
        let list = items;

        if (item.parentStoryId) {
          parent = findParent(list, item.parentStoryId);

          let internal = parent.list.find(it => it.id === item.parentStoryId);
          list = internal ? internal.list : parent.list;
        }

        let node = createNode(item, parent);
        list.push(node);
      });

      return items;
    };
  }
};
