<template>
  <div v-if="visible" :class="cls">
    <v-progress-circular
      :size="size"
      :width="width"
      indeterminate />
  </div>
</template>

<script>
export default {
  name: "Circular",
  props: {
    size: {
      type: Number,
      default: 70
    },
    width: {
      type: Number,
      default: 7
    },
    cls: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  }
};
</script>
