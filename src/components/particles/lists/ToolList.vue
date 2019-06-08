<template>
  <div class="tool-block__text">
    <div :class="`${labelCls} label--${type(item)} ${outline(index)}`"
         v-for="(item, index) in list" :key="index">
      {{ item }}
    </div>
  </div>
</template>

<script>
import Tools from '@/mixins/story';

export default {
  name: "ToolList",
  props: {
    list: {
      type: Array,
      required: true
    },
    active: {
      type: [Number, String],
      default: null,
      required: false
    },
    labelCls: {
      type: String,
      default: 'tool-block__label'
    }
  },
  mixins: [
    Tools
  ]
};
</script>
