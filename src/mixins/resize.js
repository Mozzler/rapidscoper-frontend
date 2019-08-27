import { mapMutations } from 'vuex';

export default {
  beforeCreate () {
    window.addEventListener('resize', this.resize);
  },
  beforeMount () {
    this.resize();
  },
  methods: {
    ...mapMutations('system', [
      'updateDevice'
    ]),
    async resize () {
      await this.$nextTick();

      let width = window.innerWidth < 767;
      this.updateDevice(width);
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.updateDevice);
  }
};
