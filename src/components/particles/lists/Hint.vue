<template>
  <div ref="hint"
       v-show="visible"
       :tabindex="0"
       @keydown.tab.exact="$event => tabComplete($event, items[focused])"
       @keydown.up.exact="$event => navigate($event, -1)"
       @keydown.down.exact="$event => navigate($event, 1)"
       class="hint">
    <div class="hint__item"
         v-for="(item, index) in items"
         :key="index"
         :class="{'hint__item--active': focused === index}"
         @click="() => complete(item)">
      <span class="hint__item-text">{{ getStrFromObj(item) }}</span>
    </div>
    <div class="hint__item hint__bordered"
         v-if="filter && !inList"
         @click="() => complete(filter)">
      <span class="text-bold">Ctrl + Enter</span> to create "{{ filter }}"
    </div>
  </div>
</template>

<script>
export default {
  name: "Hint",
  data () {
    return {
      visible: false,
      focused: 0,
      chapter: null,
      filter: null,
      input: null
    };
  },
  mounted () {
    this.$root.$on('set-hint-state', this.setHintState);
    this.$root.$on('complete-hint', this.complete);
    this.$root.$on('hide-hint', this.hide);
  },
  computed: {
    beginnings () {
      return this.$store.state.story.adjustConstructions;
    },
    dictionary () {
      return this.$store.state.story.dictionary;
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
    hide () {
      this.visible = false;
      this.$root.$emit('set-focus-to-input', this.input);
    },
    tabComplete ($event, value) {
      $event.preventDefault();
      this.complete(value);
    },
    setHintState (visible, chapter = null, filter = null, input = null, position = null, level) {
      Object.assign(this.$refs.hint.style, {
        left: (position.left + 56) + 'px',
        top: (position.top - 65) + 'px'
      });

      this.visible = visible;
      this.chapter = chapter;
      this.filter = filter;
      this.input = input;

      this.$nextTick(() => {
        this.$refs.hint.focus();
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
    complete (item = this.filter, first = false) {
      if (first && this.items) {
        item = this.items[0];
      }
      this.visible = false;
      this.$nextTick(() => {
        this.$root.$emit('hint-complete', this.chapter, item, this.input);
      });
    }
  },
  beforeDestroy () {
    this.$root.$off('set-hint-state');
    this.$root.$off('complete-hint');
  }
};
</script>
