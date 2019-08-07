<template>
  <div class="tool-block__text">
    <div v-for="(value, item) in list"
         :class="`label--${type(item)}`"
         :key="value.index"
         @click="() => $emit('update', index)"
         class="mr-3">
      <span>{{ value.estimate }}</span>
    </div>
  </div>
</template>

<script>
import Tools from '@/mixins/story';
import { mapGetters } from 'vuex';

export default {
  name: "SummaryList",
  mixins: [
    Tools
  ],
  props: {
    collection: {
      required: true,
      type: String
    },
  },
  data () {
    return {
      list: null
    };
  },
  beforeMount () {
    this.list = this.summary(this.collection);
  },
  computed: {
    ...mapGetters({
      summary: 'projectVersion/summary'
    })
  }
};
</script>
