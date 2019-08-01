<template>
  <div v-if="visible"
       class="rapid-alert"
       @click="hide">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: "alert",
  props: {
    message: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      visible: false
    };
  },
  methods: {
    hide () {
      this.visible = false;
    }
  },
  watch: {
    message () {
      this.visible = true;
    }
  }
};
</script>
