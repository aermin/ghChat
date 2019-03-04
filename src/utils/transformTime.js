
/**
 *
 * @param   时间戳
 * @return   yyyy-MM-dd hh:mm 格式的时间
 */

function addZero(data) {
  if (data.toString().length === 1) {
    return `0${data}`;
  }
  return data;
}

export const toNormalTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const dayOfArg = addZero(date.getDate());
  const hourOfArg = addZero(date.getHours());
  const minuteOfArg = addZero(date.getMinutes());
  const today = new Date().getDate();
  // 显示当天几点
  if (date.getDate() === today) {
    return `${hourOfArg}: ${minuteOfArg}`;
  }
  const yearOfArg = date.getFullYear();
  const monthOfArg = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}`;
  return `${yearOfArg}/${monthOfArg}/${dayOfArg}`;
};
