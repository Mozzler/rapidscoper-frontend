<template>
  <div ref="hint"
       :tabindex="0"
       v-show="visible"
       @keydown.tab.exact="$event => tabComplete($event, items[focused])"
       @keydown.enter.exact.prevent="$event => enterComplete($event, items[focused])"
       @keydown.up.exact="$event => navigate($event, -1)"
       @keydown.down.exact="$event => navigate($event, 1)"
       class="hint">
    <div class="hint__item"
         v-for="(item, index) in items"
         :key="index"
         :ref="`hint-item-${index}`"
         :class="{'hint__item--active': focused === index}"
         @click="$event => tabComplete($event, item)">
      <span :class="`hint__item-text underlined--${chapter}`"
            v-html="getStrFromObj(item, chapter === 'beginning')">
      </span>
    </div>
    <div class="hint__item hint__bordered"
         v-if="(filter && !inList) && this.chapter !== 'beginning'"
        @click="$event => complete()">
      <span class="text-bold">Enter</span> to create "{{ filter }}"
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hint',
  data () {
    return {
      visible: false,
      focused: null,
      chapter: null,
      filter: null,
      storyId: null,
      relatedDictionary: null
    };
  },
  mounted () {
    this.$root.$on('set-hint-state', this.setHintState);
    this.$root.$on('complete-hint', this.complete);
    this.$root.$on('hide-hint', this.hideHint);
    this.$root.$on('focus-hint', this.setFocus);
  },
  computed: {
    beginnings () {
      return this.$store.state.story.adjustConstructions;
    },
    dictionary () {
      return this.$store.getters['story/dictionary'];
    },
    list () {
      if (!this.chapter) {
        return [];
      }

      let list = this.dictionary[this.chapter];

      if (this.chapter === 'beginning') {
        return this.beginnings;
      }

      if (this.chapter === 'requirement') {
        return _.filter(list, item => item.type === 'requirement' && !item.relatedDictionaryId);
      }

      if (this.chapter === 'field') {
        list = this.dictionary['requirement'];

        const parent = _.find(list, item =>
          item.type === 'requirement' && !item.relatedDictionaryId &&
          item.name === this.relatedDictionary);

        return _.filter(list, item => parent && item.relatedDictionaryId === parent.id);
      }

      return list;
    },
    items () {
      const keyword = this.filter ? this.filter.toLowerCase() : '';

      return this.list.filter(item => {
        const data = this.getStrFromObj(item);
        return data.toLowerCase().includes(keyword, 0);
      });
    },
    inList () {
      const filter = this.list.filter(item => {
        return this.getStrFromObj(item) === this.filter.trim();
      });
      return Boolean(filter.length);
    }
  },
  methods: {
    async hideHint () {
      this.visible = false;
    },
    tabComplete ($event, value) {
      $event.preventDefault();
      this.complete(value);
    },
    async setHintState (visible, chapter = null, filter = null, position = null, storyId = null, relatedDictionary = null) {
      Object.assign(this.$refs.hint.style, {
        left: position.left + 'px',
        top: position.top + 'px'
      });

      this.visible = visible;
      this.chapter = chapter;
      this.filter = filter;
      this.storyId = storyId;
      this.relatedDictionary = relatedDictionary;

      await this.$nextTick();
    },
    async setFocus () {
      if (this.focused === null) {
        this.focused = 0;
      }
      await this.$nextTick();

      if (this.$refs.hint) {
        this.$refs.hint.focus();
      }
    },
    navigate ($event, step) {
      $event.preventDefault();
      step = this.focused + step;

      if (step === this.items.length) {
        step = 0;
      }
      if (step < 0) {
        step = this.items.length - 1;
      }

      this.focused = step;
    },
    complete (item = this.filter, first = false, beginning = false, storyId = this.storyId) {
      if (!item) {
        return;
      }

      if (beginning && !this.items.length) {
        return;
      }

      if (first && this.items.length) {
        item = this.items[0];
      }

      this.emit(item, storyId);
    },
    enterComplete () {
      let item = !this.items.length ? this.filter : this.items[this.focused];
      this.emit(item);
    },
    emit (item, storyId = this.storyId) {
      this.visible = false;
      this.$root.$emit('hint-complete', this.chapter, item, storyId);
      this.focused = null;
    }
  },
  beforeDestroy () {
    this.$root.$off('set-hint-state');
    this.$root.$off('complete-hint');
  }
};
</script>
