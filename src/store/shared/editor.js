import converter from './converter';

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
  let spans = markup.split('&nbsp;');

  _.each(spans, (item, index) => {
    const matched = item.match(/data-id="(.*?)"/);
    if (matched) {
      const dictionaryItem = _.find(dictionary, i => i.id === matched[1]);
      const matchedItem = item.match(/>(.*?)(?=<\/)/);

      if (matchedItem && dictionaryItem) {
        const replaceable = item.match(/data-id="(.*?)">((.*?)(?=<\/))<\/span>/)[2];
        const cleared = replaceable
          .split(/(\[\/?commentId=.*?])/g)
          .filter(item => !item.includes('commentId'))
          .join('');

        if (cleared !== dictionaryItem.name) {
          const particles = replaceable
            .split(/(\[\/?commentId=.*?])/g)
            .filter(item => item.includes('commentId'))
            .join('');

          spans[index] = item.replace(replaceable, `${particles}${dictionaryItem.name}`);
        }
      }
    }
  });

  return spans.join('&nbsp;');
}

function sections (project, sections, type) {
  return _.chain(project.sectionOrder[type])
    .map(sectionId => {
      return _.find(sections, section => section.id === sectionId);
    })
    .filter(section => section)
    .value();
}

function conformity (filters = {}, story) {
  let priority = null;
  let labels = null;

  if (filters.priorities) {
    priority = filters.priorities.length && !filters.priorities.includes(story.priority);
  }

  if (filters.labels) {
    let included = _.find(filters.labels, filter => !story.labels.includes(filter));
    labels = filters.labels.length && !_.isUndefined(included);
  }

  // doesn't match the label or priority filters
  return priority || labels;
}

function uncommented (str) {
  return str.replace(/(\[\/?commentId=.*?\])/g, '');
}

function stories (storyOrder, stories, comments, dictionary = null, filters = null) {
  const sorted = sortStoriesByOrder(stories, storyOrder);

  const filtered = _.filter(sorted, story => {
    if (filters !== null && conformity(filters, story)) {
      return;
    }

    return story;
  });

  return _.map(filtered, item => {
    const basic = _.pick(item, 'id', 'parentStoryId',
      'sectionId', 'teamId', 'projectId',
      'estimate', 'priority', 'labels', 'markup',
      'type', 'level');

    if (dictionary !== null) {
      const construction = getConstructionByType(basic.type);
      const markup = replaceMarkup(basic.markup, dictionary);

      /*console.error(basic.markup);
      console.info(markup);*/

      _.assign(basic, {
        labels: basic.labels ? basic.labels : [],
        template: construction ? construction.structure : '',
        tail: item.tail ? item.tail : '',
        markup: uncommented(markup),
        originalMarkup: markup,
        placeholder: item.placeholder ? item.placeholder : uncommented(markup)
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

function comments (commentList, userInfoList, replies = true) {
  if (!commentList || !userInfoList) {
    return;
  }

  return _.chain(commentList)
    .filter(comment => !comment.parentCommentId)
    .map(comment => {
      const user = _.find(userInfoList, u => u.userId === comment.createdUserId);
      let master = commentBuilder(comment, user);

      master.replies = _.chain(commentList)
        .filter(reply => reply.parentCommentId === comment.id)
        .map(reply => commentBuilder(reply, user))
        .value();

      return master;
    })
    .value();
}

function commentBuilder (comment, user) {
  return {
    id: comment.id,
    storyId: comment.storyId,
    avatarUrl: user ? user.avatarUrl : null,
    name: user ? user.name : null,
    content: comment.content,
    createdBy: comment.createdUserId,
    visibleToClient: comment.visibleToClient,
    parentCommentId: comment.parentCommentId,
    status: comment.status,
    time: converter.unixToDateTimeStr(comment.createdAt),
    replies: []
  };
}

export default {
  constructions,
  sections,
  stories,
  labels,
  comments
};
