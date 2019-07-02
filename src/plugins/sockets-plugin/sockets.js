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

    this.io.emit('join_collection', {model, filter, token}, async ({streamId, error}) => {
      if (streamId) {
        this.streams.push(streamId);
        cb(streamId);
      } else if (error) {
        const isSuccessfull = await store.dispatch('auth/refreshToken');

        if (isSuccessfull) {
          this.connect(model, filter, cb);
        }
      }
    });
  }

  disconnect (streamId) {
    if (this.streams.includes(streamId)) {
      this.io.emit('left_collection', streamId);
    }
  }
}

export default MongoSockets;
