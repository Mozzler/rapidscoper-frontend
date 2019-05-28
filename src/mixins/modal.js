export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      dialog: this.show
    }
  },
  watch: {
    show() {
      this.dialog = this.show;
    },
  },
  computed: {
    isMobileDevice() {
      return this.$store.state.auth.isMobileDevice;
    }
  },
}
