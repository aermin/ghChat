import * as mysql from 'mysql';
import { environment } from '@env';

const pool = mysql.createPool(environment.dbConnection);

export const query = (sql, values): Promise<any[]> => new Promise((resolve, reject) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('connection error!');
      // resolve(err);
    } else {
      connection.query(sql, values, (err, rows: any[]) => {
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
