import io from 'socket.io-client';
import config from './../../config';
import store from '../../store';

class MongoSockets {
  constructor () {
    this.io = null;
    this.streams = [];
  }

  init () {
    this.io = io.connect(config.SOCKETS_URL);
    this.setListeners();
  }

  close () {
    if (this.io) {
      this.io.close();
      this.io = null;
    }
  }

  connect (model, filter, cb) {
    const user = store.state.auth.user;
    let token = user.access_token;

    this.io.emit('join_collection', { model, filter, token }, async ({ streamId, snapshot, error }) => {
      if (streamId) {
        this.streams.push(streamId);
        cb(streamId, snapshot);
      } else if (error) {
        const isSuccessfull = await store.dispatch('auth/refreshToken');

        if (isSuccessfull) {
          this.connect(model, filter, cb);
        }
      }
    });
  }

  disconnect (streamId = []) {
    if (!store.state.auth.user) {
      return;
    }
    const userId = store.state.auth.user.id;

    if (!streamId.length) {
      this.streams.forEach(item => {
        this.io.emit('left_collection', {
          user_id: userId,
          stream_id: item
        });
      });
      this.streams = [];
      return;
    }

    streamId.forEach(item => {
      this.io.emit('left_collection', {
        user_id: userId,
        stream_id: item
      });
      this.streams = this.streams.filter(item => item !== streamId);
    });
  }

  setListeners () {
    this.io.on('mongo_data', (response) => {
      switch (response.operationType) {
        /*case 'delete':
          this.getPageData(this.page);
          break;*/
        case 'update':
        case 'insert':
          const [action, payload] = this.formatResponse(response.model, response.fullDocument);
          store.commit(action, payload);
          break;
        case 'replace':
          //this[`change`](this.mapMongoData(data.fullDocument));
          break;
      }
    });
  }

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
}

export default MongoSockets;
