import editor from "../shared/editor";

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

      return editor.stories(section.storyOrder, stories, dictionary);
    };
  },

  orderedSections (state, getters, rootState) {
    return (id, type) => {
      const sections = rootState.entity.section.items;
      const project = _.find(rootState.entity.project.items, item => item.id === id);

      return editor.sections(project, sections, type);
    };
  }
};
