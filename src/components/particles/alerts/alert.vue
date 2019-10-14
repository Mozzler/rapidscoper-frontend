<template>
  <div v-if="visible"
       :class="`rapid-alert ${cls}`"
       @click="hide">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: 'alert',
  props: {
    message: {
      type: String,
      default: null
    },
    cls: {
      type: String,
      default: 'rapid-alert--warning'
    }
  },
  data () {
    return {
      visible: !!this.message
    };
  },
  methods: {
    hide () {
      this.visible = false;
    }
  },
  watch: {
    message () {
      this.visible = !!this.message;
    }
  }
};
</script>
