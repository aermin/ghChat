import { rejects } from 'assert';

export default class Socket {
  emit(emitName, data) {
    return new Promise((resolve, reject) => {
      try {
        window.socket.emit(emitName, data, (response) => {
          resolve(response);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
