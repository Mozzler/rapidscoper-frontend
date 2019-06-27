export default {
  beforeCreate () {
    window.addEventListener('resize', this.updateDevice);
  },
  beforeMount () {
    this.updateDevice();
  },
  methods: {
    updateDevice () {
      this.$nextTick(() => {
        this.$store.commit('updateDevice', window.innerWidth < 767);
      });
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.updateDevice);
  }
};
