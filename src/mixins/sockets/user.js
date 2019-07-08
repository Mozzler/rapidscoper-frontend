export default {
  data () {
    return {
      streamId: null
    };
  },
  computed: {
    authorized () {
      return this.$store.state.auth.user;
    }
  },
  beforeMount () {
    if (this.authorized && this.authorized.access_token) {
      this.connect();
    }
  },
  methods: {
    connect () {
      this.$socket.connect('user', {
        '_id': this.authorized.user_id || this.authorized.id
      }, (streamId, data) => {
        this.streamId = streamId;
        this.$store.commit('auth/update', data);
      });
    }
  },
  beforeDestroy () {
    this.$socket.disconnect(this.streamId);
  }
};
