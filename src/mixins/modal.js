export default {
  data() {
    return {
      dialog: false
    }
  },
  beforeMount() {
    this.$root.$on(this.$options.name, this.showModal);
  },
  methods: {
    closeModal() {
      this.dialog = false;
    },
    showModal() {
      this.dialog = true;
    }
  },
  beforeDestroy() {
    this.$root.$off(this.$options.name, this.showModal);
  },
  computed: {
    isMobileDevice() {
      return this.$store.state.system.isMobileDevice;
    }
  },
}
