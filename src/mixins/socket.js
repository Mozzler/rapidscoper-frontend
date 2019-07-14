export default {
  data () {
    return {
      streams: [],
      initialization: false
    };
  },
  methods: {
    connect (model, commit, filter = null, snapshotFlag = true) {
      this.initialization = true;
      this.$socket.connect(model, filter, snapshotFlag, (snapshot) => {
        this.streams.push(model);

        if (snapshotFlag && commit) {
          this.$store.commit(commit, {
            entity: model,
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
