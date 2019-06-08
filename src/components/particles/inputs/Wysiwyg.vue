<template>
  <v-layout row fill-height>
    <v-flex shrink mr-1>
      <div
        :class="`user-story__item user-story__item--${ level }`">
        <v-layout fill-height>
          <v-flex shrink mr-1>
            <slot name="estimate"></slot>
          </v-flex>
          <v-flex grow>
            <div class="user-story__prefix"> # </div>
          </v-flex>
        </v-layout>
      </div>
    </v-flex>
    <v-flex grow>
      <div contenteditable class="user-story__editable"
           @keypress.enter.exact="enter"
           v-html="model"></div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "Wysiwyg",
  props: {
    model: {
      type: String,
      required: true
    },
    level: {
      type: [Number, String],
      default: null
    }
  },
  methods: {
    enter () {
      this.$emit('new-row', this.level + 1);
    }
  }
};
</script>
