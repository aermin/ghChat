const fs = require('fs');

/**
 * 遍历目录下的文件目录
 * @param  {string} pathResolve  需进行遍历的目录路径
 * @param  {string} mime         遍历文件的后缀名
 * @return {object}              返回遍历后的目录结果
 */
const walkFile = (pathResolve, mime) => {
  const files = fs.readdirSync(pathResolve);
  const fileList = {};
  for (const [i, item] of files.entries()) {
    const itemArr = item.split('\.');

    const itemMime = (itemArr.length > 1) ? itemArr[itemArr.length - 1] : 'undefined';
    const keyName = `${item}`;
    if (mime === itemMime) {
      fileList[item] = pathResolve + item;
    }
  }

  return fileList;
};

module.exports = walkFile;
