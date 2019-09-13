<template>
  <div v-if="msg" class="error-message">
    {{ msg }}
  </div>
</template>

<script>
export default {
  name: "error-message",
  props: {
    msg: {
      type: String,
      default: null
    }
  }
};
</script>
