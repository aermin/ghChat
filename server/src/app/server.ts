import * as http from 'http';
import * as Koa from 'koa';
import { createServer } from 'http';

import { Logger } from './utils/Logger';

const log = Logger('app:core:server');

export class Server {

  static init() {
    return new Koa();
  }

  static run(app: Koa, port: string): http.Server {
    const server = createServer(app.callback());
    server.listen(this.normalizePort(port));
    server.on('listening', () => this.onListening(server));
    server.on('error', (error) => this.onError(server, error));
    log.debug('Server was started on environment %s', process.env.NODE_ENV);
    return server;
  }

  static normalizePort(port: string): number | string | boolean {
    const parsedPort = parseInt(port, 10);
    if (isNaN(parsedPort)) { // named pipe
      return port;
    }
    if (parsedPort >= 0) { // port number
      return parsedPort;
    }
    return false;
  }

  static onListening(server: http.Server): void {
    log.debug(`Listening on ${this.bind(server.address())}`);
  }

  static onError(server: http.Server, error: Error): void {
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

  static async createConnection() {

    // console.log(`------------------------------------------------------------------------------------------------------------------`);
    // console.log(BdConfig);
    // console.log(`------------------------------------------------------------------------------------------------------------------`);

    // return await createConnection({ ...BdConfig })
    //     .then(async connection => {
    //         log.debug('Connected to DB', connection.isConnected);
    //     })
    //     .catch(error => console.log("TypeORM connection error: ", error));

  }

  private static bind(addr: string | any): string {
    return typeof addr === 'string'
      ? `pipe ${addr}`
      : `port http://localhost:${addr.port}`;
  }




}
