export default {
  data () {
    return {
      streams: [],
      initialization: false
    };
  },
  methods: {
    connect (model, commit, entity = '', filter = null, snapshotFlag = true) {
      this.initialization = true;
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
    }
  },
  beforeDestroy () {
    this.streams = [];
  }
};
