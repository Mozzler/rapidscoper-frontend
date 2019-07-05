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
    const constructions = getConstructions();

    return id => {
      const entities = rootState.entity.story.items.filter(item => item.sectionId === id);

      return entities.map(entity => {
        const key = Object.keys(constructions).filter(k => {
          return constructions[k].type === entity.type;
        });

        return {
          id: entity.id,
          parent: null,
          estimation: entity.estimate,
          priority: entity.priority,
          label: 1,

          text: entity.markup,
          template: constructions[key].structure,
          tail: '',
          placeholder: entity.markup,

          list: []
        };
      });
    };
  }
};
