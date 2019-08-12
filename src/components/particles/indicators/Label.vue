<template>
  <div class="label-indicator">
    <div v-for="(item, index) in namedLabels"
         :key="index"
         :class="`user-story__label--short label--${type(item)}`"
        @mouseover="() => mouseover(index)"
        @mouseleave="mouseleave">
      <div v-if="hovered === index" class="label-indicator__text">
        {{ item | letters }}
      </div>
    </div>
  </div>
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
      namedLabels: [],
      hovered: null
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
  },
  methods: {
    mouseover (index) {
      this.hovered = index;
    },
    mouseleave () {
      this.hovered = null;
    }
  }
};
</script>
