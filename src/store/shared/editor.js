function constructions () {
  return {
    'As a ...': {
      type: 'user',
      structure: '[beginning][actor][static-text="I can"][custom-1][static-text="so that"][custom-2]',
      limits: 'user-story'
    },
    'The system must ...': {
      type: 'technical',
      structure: '[beginning][custom-1]',
      limits: 'technical-story'
    },
    'Requires a ...': {
      type: 'requirement',
      structure: '[beginning][requirement][static-text="called"][field][custom-1]'
    },
    'When I ...': {
      type: 'acceptance',
      structure: '[beginning][custom-1][static-text="then I"][custom-2]'
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
  const cs = constructions();

  const key = Object.keys(cs).find(k => {
    return cs[k].type === type;
  });

  return cs[key];
}

// stupid code, but can't use recursion: leads to the
// 'Maximum call stack size exceeded error':
// vue watcher can't create the recursive references
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

function replaceMarkup (markup, dictionary) {
  const spans = markup.split('&nbsp;');

  _.each(spans, (item, index) => {
    const matched = item.match(/data-id="(.*?)"/);
    if (matched) {
      const dictionaryItem = _.find(dictionary, i => i.id === matched[1]);
      const replaceable = item.match(/>(.*?)(?=<\/span>)/)[1];

      if (dictionaryItem) {
        spans[index] = item.replace(replaceable, dictionaryItem.name);
      }
    }
  });

  return spans.join('&nbsp;');
}

function sections (project, sections, type) {
  return _.map(project.sectionOrder[type], sectionId => {
    return _.find(sections, section => section.id === sectionId);
  });
}

function stories (storyOrder, stories, dictionary = null) {
  const sorted = sortStoriesByOrder(stories, storyOrder);

  return _.map(sorted, item => {
    const basic = _.pick(item, 'id', 'parentStoryId',
      'sectionId', 'teamId', 'projectId',
      'estimate', 'priority', 'labels', 'markup',
      'type', 'level');

    if (dictionary !== null) {
      const construction = getConstructionByType(basic.type);
      const markup = replaceMarkup(basic.markup, dictionary);

      _.assign(basic, {
        template: construction ? construction.structure : '',
        tail: item.tail ? item.tail : '',
        markup: markup,
        placeholder: item.placeholder ? item.placeholder : markup
      });
    }

    return _.assign(basic, {
      level: getStoryLevel(basic.parentStoryId, sorted)
    });
  });
}

function labels (dictionary) {
  return _.filter(dictionary, item => item.type === 'label');
}

export default {
  constructions,
  sections,
  stories,
  labels
};
