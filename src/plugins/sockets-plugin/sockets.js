import io from 'socket.io-client';
import config from '../../config';
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

  connect (model) {
    let user = store.state.auth.user;
    let [ id, token ] = [ user.user_id, user.access_token ];

    this.io.emit('subscribe', { model, id, token }, async ({ data, error }) => {
      if (model === 'user') {
        store.commit('update', data.item);
      }
      if (model === 'team') {
        store.commit('updateTeam', data.item);
      }
    });
  }
}

export default MongoSockets;
