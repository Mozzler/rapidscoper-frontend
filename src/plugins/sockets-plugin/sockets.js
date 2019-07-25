import io from 'socket.io-client';
import config from './../../config';
import store from '../../store';
import app from '@/main';

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
    if (!this.io) {
      this.init();
    }

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
        if (Number(error.status) === 401) {
          const isSuccessfull = await store.dispatch('auth/refreshToken');
          isSuccessfull ? this.connect(model, filter, snapshotFlag, cb) : this.logout();
        } else {
          this.logout();
        }
      }
    });
  }

  logout () {
    store.dispatch('auth/logout')
      .then(() => this.disconnect())
      .then(() => {
        app.$router.push('/signup');
      });
  }

  recreateWatchers (model, globally = false) {
    this.io.emit('recreate_watcher', {
      model: model,
      token: store.state.auth.user.access_token,
      initialStreamId: this.streams[model],
      globally: globally
    });
  }

  disconnect (socketModels = []) {
    if (!socketModels.length) {
      const models = Object.keys(this.streams);
      this.deleteStream(models);
      this.close();
    }

    this.deleteStream(socketModels);
  }

  deleteStream (arr) {
    arr.forEach(item => {
      this.io.emit('left_collection', {
        user_id: store.state.auth.user.user_id,
        stream_id: this.streams[item]
      });

      delete this.streams[item];
    });
  }

  setListeners () {
    this.io.on('mongo_data', (response) => {
      switch (response.operationType) {
        case 'update':
        case 'insert':
          const commit = this.getCommitType(response.model, response.operationType);
          store.commit(commit, {
            entity: response.model,
            data: response.fullDocument
          });

          if (response.model === 'story') {
            app.$root.$emit('update-story-set');
          }

          break;
      }
    });
    this.io.on('update_dataset', ({ list, model }) => {
      store.commit('entity/setList', {
        entity: model,
        data: list
      });

      if (model === 'story') {
        app.$root.$emit('update-story-set');
      }
    });
  }

  getCommitType (model, type) {
    switch (model) {
      case 'user':
        return 'auth/update';
      default:
        return type === 'insert' ? 'entity/create' : 'entity/update';
    }
  }
}

export default MongoSockets;
