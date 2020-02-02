import * as http from 'http';
import * as Koa from 'koa';
import { createServer } from 'http';

import { Logger } from './utils/Logger';
import { appSocket } from './socket/app.socket';

const log = Logger('app:core:server');

export class Server {
  static app: Koa;
  static server: http.Server;

  static init(cb: (app: Koa) => any) {
    if (!Server.app) {
      Server.app = new Koa();

      if (cb) {
        cb(Server.app);
      }
    }
    return Server;
  }

  static createServer() {
    Server.server = createServer(Server.app.callback());
    return Server;
  }

  static run(port: string) {
    appSocket(Server.server);

    Server.server.listen(this.normalizePort(port));
    //   .on('listening', () => this.onListening(Server.server))
    //   .on('error', (error) => this.onError(Server.server, error));

    // log.debug('Server was started on environment %s', process.env.NODE_ENV);
    return Server;
  }

  static async createConnection() {
    return Server;
  }

  private static normalizePort(port: string): number | string | boolean {
    const parsedPort = parseInt(port, 10);
    if (isNaN(parsedPort)) {
      // named pipe
      return port;
    }
    if (parsedPort >= 0) {
      // port number
      return parsedPort;
    }
    return false;
  }

  private static onListening(server: http.Server): void {
    log.debug(`Listening on ${this.bind(server.address())}`);
  }

  private static onError(server: http.Server, error: Error): void {
    if (error['syscall'] !== 'listen') {
      throw error;
    }
    const addr = server.address();
    // handle specific listen errors with friendly messages
    switch (error['code']) {
      case 'EACCES':
        log.error(`${this.bind(addr)} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        log.error(`${this.bind(addr)} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  private static bind(addr: string | any): string {
    return typeof addr === 'string' ? `pipe ${addr}` : `port http://localhost:${addr.port}`;
  }
}
