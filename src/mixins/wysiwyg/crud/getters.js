import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      gIdentifier: 'story/identifier',
      projectItems: 'entity/items'
    }),
    type () {
      let type = this.$route.params.storyType.split('-');
      return _.first(type);
    },
    identifier () {
      return this.gIdentifier(this.type);
    },
    projects () {
      return this.projectItems('project');
    },
    project () {
      return _.find(this.projects, project => project.id === this.$route.params.projectId);
    }
  },
  methods: {
    getObjectId () {
      const timestamp = (new Date().getTime() / 1000 | 0).toString(16);

      return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
        return (Math.random() * 16 | 0).toString(16);
      }).toLowerCase();
    },
    getPreviousAfterStoryId (index = this.focused) {
      return index === 0 ? 0 : this.list[index - 1].id;
    },
    getAfterStoryId (startIndex = this.focused, list = this.list) {
      const substoryIndex = (startIndex + 1 < list.length) &&
        (list[startIndex + 1].level > list[startIndex].level);

      if (substoryIndex) {
        let nextStoryIndex = _.findIndex(list, (item, index) =>
          list[startIndex].level === item.level && (startIndex < index)
        );

        if (nextStoryIndex === -1) {
          nextStoryIndex = list.length;
        }

        return [...list].slice(startIndex + 1, nextStoryIndex).pop().id;
      } else {
        return list[startIndex].id;
      }
    },
    getDictionaryIds (focused = this.focused) {
      let spans = this.list[focused].markup.split('&nbsp;');
      let ids = [];

      _.each(spans, span => {
        const matched = span.match(/data-id="(.*?)"/);
        if (matched) {
          ids.push(matched[1]);
        }
      });

      return ids;
    },
    getCreateRequestPayload (sublist = false, text = '') {
      const uuid = this.getObjectId();

      if (!sublist) {
        const number = this.list[this.focused].level === 1 ? 3 : 1;
        const data = this.getSpanList(false).slice(0, number);

        text = `${data.join('')}&nbsp;`;
      }

      const data = {
        _id: uuid,
        id: uuid,
        type: this.type,
        storyIdentifier: this.identifier,
        parentStoryId: sublist ? this.list[this.focused].id : this.list[this.focused].parentStoryId,
        afterStoryId: sublist ? this.list[this.focused].id : this.getAfterStoryId(),

        estimate: 0,
        priority: null,
        labels: [],
        level: sublist ? this.list[this.focused].level + 1 : this.list[this.focused].level,

        tail: '',
        placeholder: '',
        markup: '',
        template: '',

        sectionId: this.list[this.focused].sectionId,
        teamId: this.list[this.focused].teamId,
        projectId: this.list[this.focused].projectId
      };

      return {
        entity: 'story',
        data: data
      };
    },
    getUpdateRequestPayload (focused = this.focused) {
      const data = {
        type: this.list[focused].type,
        markup: this.list[focused].markup,
        afterStoryId: this.getPreviousAfterStoryId(focused),
        parentStoryId: this.list[focused].parentStoryId,
        level: this.list[focused].level,
        dictionaryIds: this.getDictionaryIds(focused)
      };

      return {
        entity: 'story',
        data: data,
        params: {
          id: this.list[focused].id
        }
      };
    },
    getSubstoryIds (startIndex = this.focused, list = this.list) {
      const lastIndexId = this.getAfterStoryId(startIndex, list);
      const lastIndex = _.findIndex(list, item => item.id === lastIndexId);

      return list
        .slice(startIndex, lastIndex + 1)
        .map(item => item.id);
    }
  }
};
