export default {
  data () {
    return {
      streams: [],
      initialization: false
    };
  },
  methods: {
    connect (model, commit, entity = '', collection = null, snapshotFlag = true) {
      this.initialization = true;
      const filter = this.setFilter(collection);
      this.$socket.connect(model, filter, snapshotFlag, (snapshot) => {
        this.streams.push(model);

        if (snapshotFlag) {
          this.$store.commit(commit, {
            entity: entity,
            data: snapshot
          });
        }

        this.initialization = false;
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
