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
      constructions: {
        'As a ...': '[beginning][actor][static-text="I can"][custom-1][static-text="so that"][custom-2]',
        'Requires a ...': '[beginning][requirement][static-text="called"][field]',
        'When I ...': '[beginning][custom-1][static-text="then I"][custom-2]'
      },
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
  }
};
