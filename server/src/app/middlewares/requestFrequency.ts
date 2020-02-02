let timeStamp = Date.parse(new Date().toString());
let limitCount = {};

export const requestFrequency = socketId => {
  const nowTimeStamp = Date.parse(new Date().toString());
  if (nowTimeStamp - timeStamp > 60000) {
    // more than 60 seconds
    limitCount = {};
    timeStamp = nowTimeStamp;
    return false;
  } // less than 60 seconds
  if (limitCount[socketId] > 30) {
    return true;
  }
  limitCount[socketId] = (limitCount[socketId] || 0) + 1;
  return false;
};
