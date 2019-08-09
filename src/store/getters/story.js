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

      const dictionary = rootState.entity.dictionary.items;

      // sort stories in accordance with storyOrder property
      const sorted = sortStoriesByOrder(stories, section.storyOrder);


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

      return editor.sections(project, sections, type);
    };
  }
};
