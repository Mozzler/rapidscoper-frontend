export default {
  data () {
    return {
      dialog: false,
      processing: false,
    };
  },
  beforeMount () {
    this.$root.$on(this.$options.name, this.showModal);
  },
  methods: {
    closeModal () {
      this.dialog = false;
    },
    showModal () {
      this.dialog = true;
    },
    async submit (url, data) {
      this.processing = true;

      const result = await this.$validator.validate();

      if (result) {
        this.$store.dispatch(url, data)
          .then(() => {
            this.processing = false;
            this.closeModal();
          })
          .catch(error => {
            this.processing = false;
            console.log(error);
          });
      } else {
        this.processing = false;
      }
    }
  },
  beforeDestroy () {
    this.$root.$off(this.$options.name, this.showModal);
  },
  computed: {
    isMobileDevice () {
      return this.$store.state.system.isMobileDevice;
    }
  },
  watch: {
    dialog () {
      if (this.dialog) {
        this.initData();
        this.$validator.reset();
      }
    }
  }
};
