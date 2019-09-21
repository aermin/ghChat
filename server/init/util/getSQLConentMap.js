"use strict";
exports.__esModule = true;
var fs = require("fs");
var getSQLMap_1 = require("./getSQLMap");
var sqlContentMap = {};
/**
 * 读取sql文件内容
 * @param  {string} fileName 文件名称
 * @param  {string} path     文件所在的路径
 * @return {string}          脚本文件内容
 */
function getSqlContent(fileName, path) {
    var content = fs.readFileSync(path, 'binary');
    sqlContentMap[fileName] = content;
}
/**
 * 封装所有sql文件脚本内容
 * @return {object}
 */
function getSqlContentMap() {
    var sqlMap = getSQLMap_1.getSqlMap();
    for (var key in sqlMap) {
        getSqlContent(key, sqlMap[key]);
    }
    return sqlContentMap;
}
exports.getSqlContentMap = getSqlContentMap;
