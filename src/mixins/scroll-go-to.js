import { mapMutations } from 'vuex';

export default {
  methods: {
    ...mapMutations('system', [
      'freeze'
    ]),
    goTo (id) {
      const el = document.getElementById(id);
      if (el) {
        this.freeze(true);
        this.$router.replace({
          name: this.$route.name,
          params: this.getParams(id)
        });
        const container = el.closest('.content-container');
        container.scrollIntoView();

        setTimeout(() => {
          this.freeze(false);
        }, 300);
      }
    }
  }
}
