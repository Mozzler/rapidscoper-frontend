<template>
  <div class="label-indicator">
    <div v-for="(item, index) in namedLabels"
         :key="index"
         :class="`user-story__label--short`"
         :style="`background: #${item ? item.colour : ''}`"
        @mouseover="() => mouseover(index)"
        @mouseleave="mouseleave">
      <div v-if="hovered === index" class="label-indicator__text">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'labels',
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
    ...mapGetters({
      labels: 'story/labels'
    })
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
