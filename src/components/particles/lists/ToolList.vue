<template>
  <div class="tool-block__text">
    <div v-for="(item, index) in list"
         :class="`${labelCls} label--${type(item)} ${outline(index)}`"
         :key="index"
         @click="() => $emit('update', index)">
      <template v-if="shortcutted">
        <span class="text-underlined">{{ item.charAt(0) }}</span>
        <span>{{ item.slice(1) }}</span>
      </template>
      <template v-else>
        <span>{{ item }}</span>
      </template>
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
      type: [Number, String, Array],
      default: null,
      required: false
    },
    labelCls: {
      type: String,
      default: 'tool-block__label'
    },
    shortcutted: {
      default: true
    }
  },
  mixins: [
    Tools
  ]
};
</script>
