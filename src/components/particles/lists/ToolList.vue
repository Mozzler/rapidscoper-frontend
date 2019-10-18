<template>
  <div class="tool-block__text"
    :class="{'tool-block__text--minified': minified}">
    <div :class="{'onboarding': activator}">
      <div v-for="(item, index) in list"
           :class="`${labelCls} label--${type(item)} ${outline(index)} ${(index !== list.length - 1 && margin) ? 'mr-3' : ''}`"
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
  </div>
</template>

<script>
import ToolsMixin from '@/mixins/story';
import IntroductionMixin from '@/mixins/introduction';

export default {
  name: 'ToolList',
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
    },
    minified: {
      default: false
    },
    margin: {
      default: false
    },
    activator: {
      type: Boolean,
      default: false
    }
  },
  mixins: [
    ToolsMixin,
    IntroductionMixin
  ]
};
</script>
