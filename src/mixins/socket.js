export default {
  data () {
    return {
      streams: []
    };
  },
  methods: {
    connect (model, entity, commit, collection = null) {
      const filter = this.setFilter(collection);
      this.$socket.connect(model, filter, (snapshot) => {
        this.streams.push(model);
        this.$store.commit(commit, {
          entity: entity,
          data: snapshot
        });
      });
    },
    setFilter (data) {
      if (!data) {
        return null;
      }

      const idConditions = _.map(data, entity => ({
        'documentKey._id': entity.id
      }));

      return idConditions.length ? { $or: idConditions } : null;
    }
  },
  beforeDestroy () {
    this.$socket.disconnect(this.streams);
    this.streams = [];
  }
};
