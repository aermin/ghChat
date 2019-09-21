import { createPool } from 'mysql';
import { environment } from '@env';

const pool = createPool(environment.dbConnection);

export const query = (sql, values?): Promise<any> => new Promise((resolve, reject) => {
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
