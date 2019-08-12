import ErrorHandlerMixin from "@/mixins/error-handler";

export default {
  mixins: [
    ErrorHandlerMixin
  ],
  data () {
    return {
      dialog: false,
      processing: false
    };
  },
  beforeMount () {
    this.$root.$on(this.$options.name, this.showModal);
    if (typeof this.initData === 'function') {
      this.initData();
    }
  },
  methods: {
    closeModal () {
      this.dialog = false;
    },
    showModal () {
      this.dialog = true;
    },
    async submit () {
      this.processing = true;

      const result = await this.$validator.validate();

      if (!result) {
        this.processing = false;
        return;
      }

      const params = this.getPayload();

      this.$store.dispatch(params.action, params)
        .then(() => {
          if (params.recreate) {
            this.$socket.recreateWatchers(params.entity);
          }
        })
        .then(() => {
          this.processing = false;
          this.closeModal();
        })
        .catch(error => {
          this.processing = false;
          this.handleErrors(error);
        });
    }
  },
  beforeDestroy () {
    this.$root.$off(this.$options.name, this.showModal);
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
