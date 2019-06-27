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
      this.$socket.io.on('mongo_data', (data) => {
        console.log('MONGO DATA: ', data);
        switch(data.operationType) {
          /*case 'delete':
            this.getPageData(this.page);
            break;*/
          case 'update':
          case 'insert':
            const record = data.fullDocument;
            record.id = record._id;
            const action = data.model === 'user' ? 'auth/update' : `${data.model}/create`;
            this.$store.commit(action, data.fullDocument);
            break;
          case 'replace':
            //this[`change`](this.mapMongoData(data.fullDocument));
            break;
        }
      });
    }
  },
  watch: {
    authenticated () {
      if (this.authenticated) {
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
