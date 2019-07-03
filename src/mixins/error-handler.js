export default {
  data () {
    return {
      translator: {
        'uniqueNameTeamAndVersion': 'Team Title'
      }
    }
  },
  methods: {
    handleErrors (error) {
      const response = error.response;
      if (!response || response.data.length) {
        const error = response.data[0];

        const msg = { field: this.translator[error.field], msg: error.message };
        this.errors.add(msg);
      }
    }
  }
};
