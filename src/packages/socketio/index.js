import {
  io,
} from 'socket.io-client';

import {
  BASE_SOCKET_URL,
} from '../../helpers/envMap';
import API from '../GeofixAPI';

const CONFIG = {
  path: '/socket.io',
  timeout: 2000,
  reconnectionAttempts: 3,
};

class SocketClient {
  constructor(client=null) {
    this.client = client;
  }

  disconnect() {
    if (!this.client) return;
    this.client.disconnect();
    // this.client = null;
  }

  on([...args]) {
    // console.log('ye', args);
    return this.client.on(...args);
  }

  emit(eventName, payload=null, ack) {
    if (!this.client) return;
    return this.client.emit(
      eventName,
      {
        ...payload,
        token: API.getUserToken(),
      },
      ack,
    );
  }

  static connect(namespace=null) {
    let socketNamespace = '/';
    switch(namespace) {
      case 'user':
      case 'USER':
        socketNamespace = '/chat-user';
        break;
      case 'chat':
      case 'CHAT':
        socketNamespace = '/chat-message';
        break;
      default:
        socketNamespace = '/';
    }
    let socketURL = BASE_SOCKET_URL + socketNamespace;
    // console.log(socketURL);
    return io(socketURL, CONFIG);
  }
}

export default SocketClient;
