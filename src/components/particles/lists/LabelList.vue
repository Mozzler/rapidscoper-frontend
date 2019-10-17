<template>
  <div class="tool-block__text"
       :class="{'tool-block__text--minified': minified}">
    <div :class="{'onboarding': checkActiveChapter(C.INTRO_LABELS_DESCRIPTION)}">
      <div v-for="(item, index) in list"
           :key="index"
           :class="`${labelCls} ${(index !== list.length - 1 && margin) ? 'mr-3' : ''}`"
           :style="`${getStyle(index, item.colour)}`"
           @click="() => $emit('update', index)">
        <template>
          <span>{{ index + 1 }}.&nbsp;</span>
          <span>{{ item.name }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Tools from '@/mixins/story';
import IntroductionMixin from '@/mixins/introduction';

export default {
  name: 'LabelList',
  mixins: [
    Tools,
    IntroductionMixin
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
    },
    margin: {
      default: false
    }
  }
};
</script>
