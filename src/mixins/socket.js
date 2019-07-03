export default {
  computed: {
    user () {
      return this.$store.state.auth.user;
    },
    authenticated () {
      return this.user !== null;
    },
    token () {
      return this.authenticated && this.user.access_token;
    }
  },
  beforeMount () {
    if (this.token) {
      this.initSocket();
    }
  },
  methods: {
    initSocket () {
      const collections = ['team', 'project', 'user', 'section'];
      this.$socket.init();

      collections.forEach(item => {
        this.$socket.connect(item, [], (streamId) => {
          this.stream_id = streamId;
        });
      });

      this.initSocketListener();
    },
    initSocketListener () {
      this.$socket.io.on('mongo_data', (response) => {
        switch(response.operationType) {
          /*case 'delete':
            this.getPageData(this.page);
            break;*/
          case 'update':
          case 'insert':
            const [action, payload] = this.formatResponse(response.model, response.fullDocument);
            this.$store.commit(action, payload);
            break;
          case 'replace':
            //this[`change`](this.mapMongoData(data.fullDocument));
            break;
        }
      });
    },
    formatResponse (model, data) {
      switch (model) {
        case 'user':
          data.id = data._id;
          return ['auth/update', data];
        default:
          const payload = {
            entity: `${model}s`,
            data: data
          };

          payload.data.id = payload.data._id;
          return ['entity/create', payload];
      }
    }
  },
  watch: {
    token () {
      this.token ? this.initSocket() : this.$socket.close();
    }
  },
  beforeDestroy () {
    if (this.$socket.io) {
      this.$socket.io.off('mongo_data');
      this.$socket.disconnect(this.stream_id);
    }
  }
};
