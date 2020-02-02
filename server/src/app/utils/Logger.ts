import * as winston from 'winston';
import configs from '@configs';
// imports debug moduel
import * as Debug from 'debug';

// Imports the Google Cloud client library for Winston
// const { LoggingWinston } = require('@google-cloud/logging-winston');
// const loggingWinston = new LoggingWinston();

/**
 * Configures the winston logger. There are also file and remote transports available
 */
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' })
    // Add Stackdriver Logging
    // loggingWinston,
  ],
  exitOnError: false,
});

const stream = streamFunction => ({
  stream: streamFunction,
});

const write = writeFunction => ({
  write: (message: string) => writeFunction(message),
});

/**
 * Winston logger stream for the morgan plugin
 */
export const winstonStream = stream(write(logger.info));

// Configure the debug module
process.env.DEBUG = configs.logger.debug;

const debug = Debug('app:response');

/**
 * Debug stream for the morgan plugin
 */
export const debugStream = stream(write(debug));

/**
 * Exports a wrapper for all the loggers we use in this configuration
 */
const format = (scope: string, message: string): string => `[${scope}] ${message}`;

const parse = (args: any[]) => (args.length > 0 ? args : '');

export const Logger = (scope: string) => {
  const scopeDebug = Debug(scope);
  return {
    debug(message: string, ...args: any[]) {
      if (configs.production) {
        logger.debug(format(scope, message), parse(args));
      }
      scopeDebug(message, parse(args));
    },
    verbose: (message: string, ...args: any[]) =>
      logger.verbose(format(scope, message), parse(args)),
    silly: (message: string, ...args: any[]) => logger.silly(format(scope, message), parse(args)),
    info: (message: string, ...args: any[]) => logger.info(format(scope, message), parse(args)),
    warn: (message: string, ...args: any[]) => logger.warn(format(scope, message), parse(args)),
    error: (message: string, ...args: any[]) => logger.error(format(scope, message), parse(args)),
  };
};
