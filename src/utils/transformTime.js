
/**
 *
 * @param   时间戳
 * @return   yyyy-MM-dd hh:mm 格式的时间
 */
export const toNormalTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const Y = `${date.getFullYear()}-`;
  const M = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-`;
  const D = `${date.getDate()} `;
  const h = `${date.getHours()}:`;
  const m = date.getMinutes();
  return Y + M + D + h + m;
};
