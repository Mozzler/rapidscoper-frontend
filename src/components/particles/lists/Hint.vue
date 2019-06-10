<template>
  <div ref="hint" v-show="visible" class="hint">
    <div class="hint__item"
         v-for="(item, index) in items"
         :key="index"
         @click="event => complete(event, index)">
      {{ item }}
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
    setHintState (visible, chapter, filter = null, input) {
      this.visible = visible;
      this.chapter = chapter;
      this.filter = filter;
      this.input = input;
    },
    complete ($event) {
      this.$root.$emit('hint-complete', this.chapter, $event.target.innerHTML, this.input);
      this.visible = false;
    }
  },
  beforeDestroy () {
    this.$root.$off('set-hint-state');
  }
};
</script>
