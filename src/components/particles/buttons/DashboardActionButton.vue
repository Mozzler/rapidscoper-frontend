<template>
  <div>
    <slot name="mobile" v-if="mobile && $store.state.auth.isMobileDevice"/>
    <v-btn large v-else
           class="btn-rapid primary large">
      {{ text }}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'DashboardActionButton',
  props: {
    text: {
      default: null,
      type: String
    },
    mobile: {
      default: false,
      type: Boolean
    }
  }
};
</script>
