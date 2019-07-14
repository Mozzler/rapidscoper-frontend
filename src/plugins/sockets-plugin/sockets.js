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
    this.setListeners();
  }

  close () {
    if (this.io) {
      this.io.close();
      this.io = null;
    }
  }

  connect (model, filter, snapshotFlag, cb) {
    if (this.streams[model]) {
      this.disconnect([model]);
    }

    const user = store.state.auth.user;
    let token = user.access_token;

    this.io.emit('join_collection', { model, filter, token }, snapshotFlag, async ({ streamId, snapshot, error }) => {
      if (!error) {
        this.streams[model] = streamId;
        cb(snapshot);
      } else {
        const isSuccessfull = await store.dispatch('auth/refreshToken');

        if (isSuccessfull) {
          this.connect(model, filter, cb);
        }
      }
    });
  }

  recreateWatchers (model) {
    this.io.emit('recreate_watcher', {
      model: model,
      token: store.state.auth.user.access_token
    });
  }

  disconnect (socketModels = []) {
    if (!socketModels.length) {
      const models = Object.keys(this.streams);
      return this.deleteStream(models);
    }

    this.deleteStream(socketModels);
  }

  deleteStream (arr) {
    arr.forEach(item => {
      this.io.emit('left_collection', {
        user_id: store.state.auth.user.id,
        stream_id: this.streams[item]
      });

      delete this.streams[item];
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
    this.io.on('update_dataset', ({ list, model }) => {
      const payload = {
        entity: `${model}s`,
        data: list
      };

      store.commit('entity/setList', payload);
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
