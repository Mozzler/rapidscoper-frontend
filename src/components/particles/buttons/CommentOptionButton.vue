<template>
  <v-btn icon v-if="visible" @click="clickHandler">
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
export default {
  name: 'CommentOptionButton',
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
    }
  }
};
</script>
