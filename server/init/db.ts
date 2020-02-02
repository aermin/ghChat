import { createPool } from 'mysql';
import configs from '../src/configs/configs.dev';
// import configs from '../src/configs/configs.prod'; //if use in production

const pool = createPool(configs.dbConnection);

export const query = (sql, values?): Promise<any> =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.log('query connec error!', err);
        // resolve(err);
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
          connection.release();
        });
      }
    });
  });
