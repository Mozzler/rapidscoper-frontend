<template>
  <div class="tool-block__text"
    :class="{'tool-block__text--minified': minified}">
    <circular-loader
      cls="loader-shadow--without-padding transparent"
      :size="50"
      :width="5"
      :visible="loader"
    />
    <div v-for="(item, index) in list"
         :class="`${labelCls} label--${type(item)} ${outline(index)}`"
         :key="index"
         @click="() => $emit('update', index)"
         class="mr-3">
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
import CircularLoader from "../../particles/loaders/Circular";

export default {
  name: "ToolList",
  components: {
    CircularLoader
  },
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
    loader: {
      default: false
    },
    minified: false
  },
  mixins: [
    Tools
  ]
};
</script>
