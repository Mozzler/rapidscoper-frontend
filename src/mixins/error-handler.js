export default {
  data () {
    return {
      translator: {
        'uniqueNameTeamAndVersion': 'Team Title',
        'uniqueUrlStub': 'Team name'
      }
    };
  },
  methods: {
    handleErrors (error, msgOnly = false) {
      const response = error.response;
      if (response && response.data.length) {
        const error = response.data[0];

        if (msgOnly) {
          return error.message;
        }

        const field = this.translator[error.field];
        const msg = { field: field || error.field, msg: error.message };
        this.errors.add(msg);
      }
    },
    logout () {
      this.$store.dispatch('auth/logout')
        .then(() => this.$socket.disconnect())
        .then(() => {
          this.$router.push('/signup');
        });
    }
  }
};
