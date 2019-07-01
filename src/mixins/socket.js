export default {
  computed: {
    authenticated () {
      return this.$store.state.auth.user !== null;
    }
  },
  beforeMount () {
    if (this.authenticated) {
      this.initSocket();
    }
  },
  methods: {
    initSocket () {
      this.$socket.init();
      this.$socket.connect('team', [], (streamId) => {
        this.stream_id = streamId;
      });
      this.$socket.connect('user', [], (streamId) => {
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
            const payload = {
              entity: `${response.model}s`,
              data: response.fullDocument
            };
            const action = payload.entity === 'user' ? 'auth/update' : `entity/create`;
            this.$store.commit(action, payload);
            break;
          case 'replace':
            //this[`change`](this.mapMongoData(data.fullDocument));
            break;
        }
      });
    },
    fetchData () {
      this.$store.dispatch('auth/getInfo');

      ['team', 'project'].forEach(item => {
        this.$store.dispatch('entity/getList', { entity: item });
      });
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
    }
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
