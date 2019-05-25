<template>
  <v-btn large class="btn-rapid primary large">
    {{ text }}
  </v-btn>
</template>

<script>
export default {
  name: 'DashboardActionButton',
  props: {
    text: {
      default: null,
      type: String
    }
  }
};
</script>
