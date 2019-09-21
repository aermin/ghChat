"use strict";
exports.__esModule = true;
var path = require("path");
var rootUrl = path.join(process.cwd(), 'dist');
exports.environment = {
    production: false,
    rootUrl: rootUrl,
    staticPath: path.join(rootUrl, './build'),
    port: '3000',
    host: '127.0.0.1',
    jwt_secret: 'chat-sec',
    dbConnection: {
        port: 3306,
        database: 'ghchat',
        user: 'root',
        password: '123456'
    },
    baseApi: 'api/v1',
    secret: 'chat-sec',
    logger: {
        debug: 'app*',
        console: {
            level: 'error'
        }
    }
};
