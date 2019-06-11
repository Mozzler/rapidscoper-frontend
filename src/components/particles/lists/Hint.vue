<template>
  <div ref="hint" v-show="visible" class="hint">
    <div class="hint__item"
         v-for="(item, index) in items"
         :key="index"
         @click="event => complete(item)">
      <span class="hint__item-text">{{ item }}</span>
    </div>
    <div class="hint__item hint__bordered"
         v-if="filter"
         @click="event => complete(filter)">
      <span class="text-bold">Ctrl + Enter</span> to create "{{ filter }}"
    </div>
  </div>
</template>

<script>
export default {
  name: "Hint",
  data () {
    return {
      chapter: null,
      filter: null,
      visible: false,
      input: null
    };
  },
  beforeMount () {
    this.$root.$on('set-hint-state', this.setHintState);
  },
  computed: {
    dictionary () {
      return this.$store.state.story.dictionary;
    },
    items () {
      let list = this.dictionary[this.chapter];
      if (!list) {
        return [];
      }
      let filtered = list.filter(item => {
        return item.includes(this.filter);
      });
      return this.filter ? filtered : list;
    }
  },
  methods: {
    setHintState (visible, chapter, filter = null, input, position) {
      Object.assign(this.$refs.hint.style, {
        left: (56 + position.left) + 'px',
        top: position.top + 'px'
      });

      this.visible = visible;
      this.chapter = chapter;
      this.filter = filter;
      this.input = input;
    },
    complete (item) {
      this.$root.$emit('hint-complete', this.chapter, item, this.input);
      this.visible = false;
    }
  },
  beforeDestroy () {
    this.$root.$off('set-hint-state');
  }
};
</script>
