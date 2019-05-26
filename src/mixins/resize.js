export default {
  beforeCreate() {
    window.addEventListener('resize', () => {
      this.$nextTick(this.updateDevice);
    });
  },
  beforeMount() {
    this.updateDevice();
  },
  methods: {
    updateDevice() {
      this.$store.commit('updateDevice', window.innerWidth < 767);
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize');
  }
}
