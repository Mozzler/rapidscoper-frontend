import ErrorHandlerMixin from "@/mixins/error-handler";

export default {
  mixins: [
    ErrorHandlerMixin
  ],
  data () {
    return {
      dialog: false,
      processing: false,
      params: null
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
    showModal (params) {
      this.dialog = true;
      this.params = params;
    },
    async submit (cb = null) {
      this.processing = true;

      const result = await this.$validator.validate();

      if (!result) {
        this.processing = false;
        return;
      }

      const params = this.getPayload();

      this.$store.dispatch(params.action, params)
        .then((response) => {
          if (params.recreate) {
            this.$socket.recreateWatchers(params.entity);
          }
          if (cb !== null) {
            this.processing = false;
            this.closeModal();
            this[cb](response.item);
          }
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
      if (this.dialog && typeof this.initData === 'function') {
        this.initData();
        this.$validator.reset();
      }
    }
  }
};
