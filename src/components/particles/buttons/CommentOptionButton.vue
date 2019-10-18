<template>
  <v-btn icon v-if="visible" @click="clickHandler"
         :class="{'onboarding--without-pm': onboarding && checkActiveChapter(C.INTRO_COMMENT_ACTIONS)}">
    <v-tooltip bottom content-class="comment__tooltip">
      <template v-slot:activator="{ on }">
        <div v-on="on">
          <v-icon v-if="iconVisible">{{ iconIf }}</v-icon>
          <v-icon v-else class="primary-icon">{{ iconElse }}</v-icon>
        </div>
      </template>
      <span>{{ text }}</span>
    </v-tooltip>
  </v-btn>
</template>

<script>
import IntroductionMixin from '@/mixins/introduction';

export default {
  name: 'CommentOptionButton',
  mixins: [
    IntroductionMixin
  ],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    clickHandler: {
      type: Function,
      default: null
    },
    iconVisible: {
      type: Boolean,
      default: false
    },
    iconIf: {
      type: String
    },
    iconElse: {
      type: String
    },
    text: {
      type: String
    },
    onboarding: {
      type: Boolean,
      default: false
    }
  }
};
</script>
