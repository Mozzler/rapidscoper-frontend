<template>
  <div ref="hint" v-show="visible" class="hint">
    <div class="hint__item"
         v-for="(item, index) in items"
         :key="index"
         @click="() => complete(item)">
      <span class="hint__item-text">{{ item }}</span>
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
    list () {
      return this.chapter ? this.dictionary[this.chapter] : [];
    },
    items () {
      const keyword = this.filter ? this.filter.toLowerCase() : '';
      return this.list.filter(item => item.toLowerCase().includes(keyword));
    },
    inList () {
      const filter = this.list.filter(item => item === this.filter.trim());
      return Boolean(filter.length);
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
