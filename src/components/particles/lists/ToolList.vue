<template>
  <div class="tool-block__text">
    <div v-for="(item, index) in list"
         :class="`${labelCls} label--${type(item)} ${outline(index)}`"
         :key="index"
         @click="() => $emit('update', index)">
      <span class="text-underlined">{{ item.charAt(0) }}</span>
      <span>{{ item.slice(1) }}</span>
    </div>
  </div>
</template>

<script>
import Tools from '@/mixins/story';

export default {
  name: "ToolList",
  props: {
    list: {
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
