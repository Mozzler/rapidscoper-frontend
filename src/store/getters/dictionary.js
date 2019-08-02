export default {
  sections (state, getters, rootState) {
    const dictionary = rootState.entity.dictionary.items;
    const sections = [{
      name: 'Actor',
      type: 'actor',
      list: []
    }, {
      name: 'Others',
      type: 'custom',
      list: []
    }];

    _.each(dictionary, item => {
      if (item.type === 'requirement' && !item.relatedDictionaryId) {
        sections.push({
          ...item,
          list: []
        });
      }
    });

    return sections;
  },

  items (state, getters, rootState) {
    const dictionary = rootState.entity.dictionary.items;
    const sections = getters.sections;

    _.each(dictionary, el => {
      let notReq = el.type !== 'requirement';
      let req = el.relatedDictionaryId && el.type === 'requirement';
      let j = null;

      if (req) {
        j = _.findIndex(sections, chapter => {
          return chapter.id === el.relatedDictionaryId;
        });
      }

      if (notReq) {
        j = _.findIndex(sections, chapter => {
          return chapter.type === el.type;
        });
      }

      if (j) {
        sections[j].list.push(el);
      }
    });

    if (sections.length > 2) {
      [sections[1], sections[sections.length - 1]] = [sections[sections.length - 1], sections[1]];
    }

    return sections;
  }
};
