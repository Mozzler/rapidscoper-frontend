import io from 'socket.io-client';
import config from './../../config';
import store from '../../store';

class MongoSockets {
  constructor () {
    this.io = null;
    this.streams = {};
  }

  init () {
    this.io = io.connect(config.SOCKETS_URL);
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
        this.streams[model] = streamId;
        cb(streamId, snapshot);
      } else if (error) {
        const isSuccessfull = await store.dispatch('auth/refreshToken');

        if (isSuccessfull) {
          this.connect(model, filter, cb);
        }
      }
    });

    this.setListeners();
  }

  disconnect (streamId = null, model = null) {
    const userId = store.state.auth.user.id;

    switch (true) {
      case !!model:
        this.io.emit('left_collection', {
          user_id: userId,
          stream_id: this.streams[model]
        });
        return;
      case !!streamId:
        const property = Object.keys(this.streams).filter(key => this.streams[key] === streamId);
        this.io.emit('left_collection', {
          user_id: userId,
          stream_id: this.streams[property]
        });
        return;
      case !model && !streamId:
        Object.keys(this.streams).forEach(key => {
          this.io.emit('left_collection', {
            user_id: userId,
            stream_id: this.streams[key]
          });
        });
        this.streams = {};

        this.io.off('mongo_data');
    }
  }

  setListeners () {
    this.io.on('mongo_data', (response) => {
      console.log('responsed', response);
      switch (response.operationType) {
        /*case 'delete':
          this.getPageData(this.page);
          break;*/
        case 'update':
        case 'insert':
          console.log(response);
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
