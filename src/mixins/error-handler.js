export default {
  data () {
    return {
      translator: {
        'uniqueNameTeamAndVersion': 'Team Title',
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
        const msg = { field: field || 'other', msg: error.message };
        this.errors.add(msg);
      }
    }
  }
};
