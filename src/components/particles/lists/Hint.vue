<template>
  <div ref="hint"
       :tabindex="0"
       v-show="visible"
       @keydown.tab.exact="$event => tabComplete($event, items[focused])"
       @keydown.enter.exact.prevent="$event => complete(filter)"
       @keydown.up.exact="$event => navigate($event, -1)"
       @keydown.down.exact="$event => navigate($event, 1)"
       class="hint">
    <div class="hint__item"
         v-for="(item, index) in items"
         :key="index"
         :ref="`hint-item-${index}`"
         :class="{'hint__item--active': focused === index}"
         @click="$event => tabComplete($event, item)">
      <span class="hint__item-text">{{ getStrFromObj(item) }}</span>
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
  name: "Hint",
  data () {
    return {
      visible: false,
      focused: null,
      chapter: null,
      filter: null,
      input: null
    };
  },
  mounted () {
    this.$root.$on('set-hint-state', this.setHintState);
    this.$root.$on('complete-hint', this.complete);
    this.$root.$on('hideHint-hint', this.hideHint);
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

      return this.chapter === 'beginning' ? this.beginnings : this.dictionary[this.chapter];
    },
    items () {
      const keyword = this.filter ? this.filter.toLowerCase() : '';
      return this.list.filter(item => this.getStrFromObj(item).toLowerCase().includes(keyword, 0));
    },
    inList () {
      const filter = this.list.filter(item => {
        return this.getStrFromObj(item) === this.filter.trim();
      });
      return Boolean(filter.length);
    }
  },
  methods: {
    hideHint () {
      this.visible = false;
    },
    tabComplete ($event, value) {
      $event.preventDefault();
      this.complete(value);
    },
    setHintState (visible, chapter = null, filter = null, input = null, position = null, addresserId = null) {
      const selection = document.getSelection().focusNode;
      this.focusedElId = selection.id || selection.parentNode.offsetParent.id;
      if (addresserId !== this.focusedElId) {
        return;
      }

      Object.assign(this.$refs.hint.style, {
        left: position.left + 'px',
        top: position.top + 'px'
      });

      this.visible = visible;
      this.chapter = chapter;
      this.filter = filter;
      this.input = input;
    },
    setFocus () {
      if (this.focused === null) {
        this.focused = 0;
      }
      this.$nextTick(() => {
        if (this.$refs.hint) {
          this.$refs.hint.focus();
        }
      });
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
    complete (item = this.filter, first = false, beginning = false) {
      if (!item) {
        return;
      }

      if (beginning) {
        return;
      }

      if (first && this.items.length) {
        item = this.items[0];
      }

      this.visible = false;
      this.$root.$emit('hint-complete', this.chapter, item, this.focusedElId);
      this.focused = null;
    }
  },
  beforeDestroy () {
    this.$root.$off('set-hint-state');
    this.$root.$off('complete-hint');
  }
};
</script>
