import * as path from 'path';

const rootUrl = path.join(process.cwd(), 'dist');

export default {
  rootUrl: path.join(process.cwd(), 'dist'),
  staticPath: path.join(rootUrl, '../build'),
  logger: {
    debug: 'app*',
    console: {
      level: 'error',
    },
  },
};
