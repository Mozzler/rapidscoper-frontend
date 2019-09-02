<template>
  <div class="tool-block__text tool-block__text--fixed">
    <v-layout
      v-for="(value, key) in list"
      :class="`${labelCls} label--${type(key)}`"
      :style="`background: ${background(value)}`"
      :key="value.index"
      align-center
      justify-space-between
      row
      fill-height
      mb-2
      v-if="key !== 'Total' || total">
        <span>{{ key }}</span>
        <span :class="{ 'text-bold': key === 'Total' }">
          {{ value.estimate }}
        </span>
    </v-layout>
  </div>
</template>

<script>
import Tools from '@/mixins/story';
import { mapGetters } from 'vuex';

export default {
  name: 'SummaryList',
  inject: ['entity'],
  mixins: [
    Tools
  ],
  props: {
    collection: {
      required: true,
      type: String
    },
    total: {
      required: false,
      default: false
    },
    labelCls: {
      required: false,
      default: 'tool-block__label'
    }
  },
  data () {
    return {
      list: null
    };
  },
  beforeMount () {
    this.list = this.summary(this.collection, this.entity);
  },
  computed: {
    ...mapGetters({
      summary: 'projectVersion/summary'
    })
  },
  methods: {
    background (value) {
      return _.isObject(value) ? `#${value.colour}` : '';
    }
  }
};
</script>
