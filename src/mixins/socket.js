export default {
  data () {
    return {
      streamId: null
    };
  },
  methods: {
    connect (model, filter, commit) {
      this.$socket.connect(model, filter, (streamId, data) => {
        this.streamId = streamId;
        data.model = model;
        this.$store.commit(commit, data);
      });
    }
  },
  beforeDestroy () {
    this.$socket.disconnect(this.streamId);
  }
};
