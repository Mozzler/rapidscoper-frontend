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
  let spans = markup.split('</span>');

  spans = _.map(spans, span => {
    return span.includes('<span') ? `${span}</span>` : span;
  });

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

  return spans.join('');
}

function sections (project, sections, type) {
  return _.map(project.sectionOrder[type], sectionId => {
    return _.find(sections, section => section.id === sectionId);
  });
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

      _.assign(basic, {
        labels: basic.labels ? basic.labels : [],
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

function unixToDate (str) {
  moment.locale('fr', {
    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
    monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
    monthsParseExact : true,
    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
      LT : 'HH:mm',
      LTS : 'HH:mm:ss',
      L : 'DD/MM/YYYY',
      LL : 'D MMMM YYYY',
      LLL : 'D MMMM YYYY HH:mm',
      LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
      sameDay : '[Aujourd’hui à] LT',
      nextDay : '[Demain à] LT',
      nextWeek : 'dddd [à] LT',
      lastDay : '[Hier à] LT',
      lastWeek : 'dddd [dernier à] LT',
      sameElse : 'L'
    },
    relativeTime : {
      future : 'dans %s',
      past : 'il y a %s',
      s : 'quelques secondes',
      m : 'une minute',
      mm : '%d minutes',
      h : 'une heure',
      hh : '%d heures',
      d : 'un jour',
      dd : '%d jours',
      M : 'un mois',
      MM : '%d mois',
      y : 'un an',
      yy : '%d ans'
    },
    dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
    ordinal : function (number) {
      return number + (number === 1 ? 'er' : 'e');
    },
    meridiemParse : /PD|MD/,
    isPM : function (input) {
      return input.charAt(0) === 'M';
    },
    // In case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example).
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
    // },
    meridiem : function (hours, minutes, isLower) {
      return hours < 12 ? 'PD' : 'MD';
    },
    week : {
      dow : 1, // Monday is the first day of the week.
      doy : 4  // Used to determine first week of the year.
    }
  });

  moment.locale('fr');
  moment(1316116057189).fromNow(); // il y a une heure
  moment.locale('en');
  moment(1316116057189).fromNow(); // an hour ago

  
  return str;
}

function comments (commentList, userInfoList) {
  if (!commentList || !userInfoList) {
    return;
  }

  return _.map(commentList, comment => {
    let user = _.find(userInfoList, u => u.userId === comment.createdUserId);

    return {
      avatarUrl: user ? user.avatarUrl : null,
      name: user ? user.name : null,
      text: comment.content,
      time: unixToDate(comment.createdAt)
    };
  });
}

export default {
  constructions,
  sections,
  stories,
  labels,
  comments
};
