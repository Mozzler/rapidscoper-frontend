<template>
  <div ref="hint" v-show="visible">
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
      list: [],
      filter: null,
      visible: false
    };
  },
  beforeMount () {
    this.$root.$on('set-hint-state', this.setHintState);
  },
  computed: {
    items () {
      let filtered = this.list.filter(item => {
        return item.includes(this.filter);
      });
      return this.filter ? filtered : this.list;
    }
  },
  methods: {
    setHintState (visible, list = [], filter = null) {
      this.visible = visible;
      this.list = list;
      this.filter = filter;
    }
  },
  beforeDestroy () {
    this.$root.$off('set-hint-state');
  }
};
</script>
