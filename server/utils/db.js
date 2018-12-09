const mysql = require('mysql');
const dbConfig = require('../config').db;

const pool = mysql.createPool({
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  host: dbConfig.host,
});


const query = (sql, values) => new Promise((resolve, reject) => {
  pool.getConnection((err, connection) => {
    if (err) {
      resolve(err);
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


module.exports = {
  query
};
