<template>
  <span class="label-indicator">
    <i v-for="(item, index) in namedLabels"
         :key="index"
         :class="`user-story__label--short label--${type(item)}`">
    </i>
  </span>
</template>

<script>
import Tools from '@/mixins/story';

export default {
  name: "priority",
  mixins: [
    Tools
  ],
  props: {
    list: {
      default: [],
      required: true
    }
  },
  data () {
    return {
      namedLabels: []
    };
  },
  beforeMount () {
    this.namedLabels = _.map(this.list, index => {
      return this.labels[index];
    });
  },
  computed: {
    labels () {
      return this.$store.state.story.labels;
    }
  }
};
</script>
