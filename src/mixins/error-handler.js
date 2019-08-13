export default {
  data () {
    return {
      translator: {
        'uniqueNameTeamAndVersion': ['Team Title', 'Project Name'],
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

        const field = this.translate(error.field);
        const msg = { field: field || error.field, msg: error.message };
        this.errors.add(msg);
      }
    },
    translate (field) {
      const value = this.translator[field];

      if (_.isArray(value)) {
        const found = _.find(this.$validator.fields.items, item => value.includes(item.name));
        return found ? found.name : null;
      }

      return value;
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
