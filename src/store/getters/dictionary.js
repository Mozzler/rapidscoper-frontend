import filters from '../shared/filters';

export default {
  sections (state, getters, rootState) {
    return filters.chapters(rootState.entity.dictionary.items);
  },

  items (state, getters, rootState) {
    const dictionary = rootState.entity.dictionary.items;
    const sections = getters.sections;

    return filters.volumns(dictionary, sections);
  }
};
