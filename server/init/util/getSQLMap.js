"use strict";
exports.__esModule = true;
var walkFile_1 = require("./walkFile");
/**
 * 获取sql目录下的文件目录数据
 * @return {object}
 */
function getSqlMap() {
    var basePath = __dirname;
    basePath = basePath.replace(/\\/g, '\/');
    var pathArr = basePath.split('\/');
    pathArr = pathArr.splice(0, pathArr.length - 1);
    basePath = pathArr.join('/') + "/sql/";
    var fileList = walkFile_1.walkFile(basePath, 'sql');
    return fileList;
}
exports.getSqlMap = getSqlMap;
