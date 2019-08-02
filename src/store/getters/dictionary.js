export default {
  sections (state, getters, rootState) {
    const dictionary = rootState.entity.dictionary.items;
    return _.chain(dictionary)
      .filter(item => !item.relatedDictionaryId)
      .map(item => {
        return {
          ...item,
          list: []
        };
      })
      .value();
  },

  items (state, getters, rootState) {
    const dictionary = rootState.entity.dictionary.items;
    const sections = getters.sections;

    _.each(dictionary, el => {
      if (el.relatedDictionaryId) {
        const j = _.findIndex(sections, chapter => {
          return chapter.id === el.relatedDictionaryId;
        });

        sections[j].list.push(el);
      }
    });

    return sections;
  }
};
