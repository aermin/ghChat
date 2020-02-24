/* eslint-disable no-sequences */
import axios from 'axios';

export default class Request {
  static axiosConfigInit() {
    if (process.env.NODE_ENV !== 'production') {
      axios.defaults.baseURL = 'http://localhost:3000';
    }
  }

  static async axios(method = 'get', url, params) {
    const handleMethod = method === 'get' && params ? { params } : params;
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-unused-expressions
      axios[method](url, handleMethod)
        .then(res => {
          const response = typeof res.data === 'object' ? res.data : JSON.parse(res.data);
          resolve(response);
        })
        .catch(error => {
          reject(error.response ? error.response.data : error);
        });
    });
  }

  static socketEmit(emitName, data, onError) {
    try {
      window.socket.emit(emitName, data);
    } catch (error) {
      if (onError) {
        onError(error);
      }
    }
  }

  static socketEmitAndGetResponse(emitName, data, onError) {
    return new Promise((resolve, reject) => {
      try {
        window.socket.emit(emitName, data, response => {
          resolve(response);
        });
      } catch (error) {
        if (onError) {
          onError(error);
        }
        reject(error);
      }
    });
  }
}
