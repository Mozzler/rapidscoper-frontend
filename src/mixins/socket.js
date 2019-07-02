export default {
  computed: {
    authenticated () {
      return this.$store.state.auth.user !== null;
    }
  },
  beforeMount () {
    if (this.authenticated) {
      this.initSocket();
      this.fetchData();
    }
  },
  methods: {
    initSocket () {
      this.$socket.init();
      this.$socket.connect('user', [], (streamId) => {
        this.stream_id = streamId;
      });
      this.$socket.connect('team', [], (streamId) => {
        this.stream_id = streamId;
      });
      this.$socket.connect('project', [], (streamId) => {
        this.stream_id = streamId;
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
    },
    fetchData () {
      this.$store.dispatch('auth/getInfo');
      this.$store.dispatch('entity/getList', { entity: 'team' });
    }
  },
  watch: {
    authenticated () {
      if (this.authenticated) {
        this.fetchData();
        this.initSocket();
      } else {
        this.$socket.close();
      }
    },
  },
  beforeDestroy() {
    if (this.$socket.io) {
      this.$socket.io.off('mongo_data');
    }

    if (this.stream_id) {
      this.$socket.disconnect(this.stream_id);
    }
  },
};
