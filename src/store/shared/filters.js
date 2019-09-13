function chapters (dictionary) {
  const sections = [{
    id: 'actor',
    name: 'Actor',
    type: 'actor',
    list: []
  }, {
    id: 'others',
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

  if (sections.length > 2) {
    [sections[1], sections[sections.length - 1]] = [sections[sections.length - 1], sections[1]];
  }

  return sections;
}

function volumns (dictionary, sections) {
  _.each(dictionary, el => {
    let req = el.relatedDictionaryId && el.type === 'requirement';
    let notReq = el.type !== 'requirement';
    let j = -1; // findIndex returns -1, if item not found

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

    if (j !== -1) {
      sections[j].list.push(el);
    }
  });

  return sections;
}

export default {
  chapters,
  volumns
};
