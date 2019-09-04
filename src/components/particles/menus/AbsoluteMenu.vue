<template>
  <v-menu v-model="state"
          :position-x="x"
          :position-y="y"
          absolute>
    <slot name="content" class="sidebar-popup-menu" />
  </v-menu>
</template>

<script>
export default {
  name: 'AbsoluteMenu',
  props: [
    'x', 'y',
    'visible'
  ],
  data () {
    return {
      state: this.visible
    };
  },
  watch: {
    visible () {
      this.state = this.visible;
    }
  }
};
</script>
