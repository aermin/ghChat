/* eslint-disable prettier/prettier */
import { walkFile } from './walkFile';

/**
 * 获取sql目录下的文件目录数据
 * @return {object}
 */
export function getSqlMap(): object {
  let basePath = __dirname;
  basePath = basePath.replace(/\\/g, '/');

  let pathArr = basePath.split('/');
  pathArr = pathArr.splice(0, pathArr.length - 1);
  basePath = `${pathArr.join('/')}/sql/`;

  const fileList = walkFile(basePath, 'sql');
  return fileList;
}
