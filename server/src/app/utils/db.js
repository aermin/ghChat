"use strict";
exports.__esModule = true;
var mysql_1 = require("mysql");
var environment_1 = require("../../environments/environment");
var pool = mysql_1.createPool(environment_1.environment.dbConnection);
exports.query = function (sql, values) { return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log('connection error!', err);
            // resolve(err);
        }
        else {
            connection.query(sql, values, function (err, rows) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
                connection.release();
            });
        }
    });
}); };
