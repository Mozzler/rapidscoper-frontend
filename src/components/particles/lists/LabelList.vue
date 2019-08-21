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
         :key="index"
         :class="labelCls"
         :style="`${getStyle(index, item.colour)}`"
         @click="() => $emit('update', index)"
         class="mr-3">
      <template>
        <span>{{ index + 1 }}.&nbsp;</span>
        <span>{{ item.name }}</span>
      </template>
    </div>
  </div>
</template>

<script>
import CircularLoader from "../../particles/loaders/Circular";
import Tools from '@/mixins/story';

export default {
  name: 'LabelList',
  components: {
    CircularLoader
  },
  mixins: [
    Tools
  ],
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
    loader: {
      default: false
    },
    minified: {
      default: false
    }
  }
};
</script>
