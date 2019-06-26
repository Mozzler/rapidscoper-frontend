import MongoSockets from './sockets';

let VueSocketsPlugin = {};

VueSocketsPlugin.install = (Vue) => {
  const mongoSockets = new MongoSockets();

  Vue.$socket = mongoSockets;

  Object.defineProperties(Vue.prototype, {
    $socket: {
      get () {
        return mongoSockets;
      }
    }
  });
};

export default VueSocketsPlugin;
