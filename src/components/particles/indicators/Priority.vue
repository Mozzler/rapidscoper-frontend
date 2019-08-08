<template>
  <span v-if="priority"
    :class="`user-story__priority--short label--${type(priority)}`">
    {{ priority.charAt(0) }}
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
    index: {
      default: 0,
      required: true
    }
  },
  data () {
    return {
      priority: null
    };
  },
  beforeMount () {
    this.priority = this.priorities[this.index];
  },
  computed: {
    priorities () {
      return this.$store.state.story.priority;
    }
  }
};
</script>
