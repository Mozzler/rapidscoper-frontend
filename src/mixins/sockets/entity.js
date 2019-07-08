export default {
  methods: {
    connectEntity (entity, filters) {
      this.$socket.connect(entity, filters, (streamId, data) => {
        this.streamId = streamId;
        this.$store.commit('auth/update', data);
      });
    }
  }
}
