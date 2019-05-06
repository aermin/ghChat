let timeStamp = Date.parse(new Date());
let limitCount = {};

module.exports = function requestFrequency(socketId) {
  const nowTimeStamp = Date.parse(new Date());
  if (nowTimeStamp - timeStamp > 60000) { // more than 60 seconds
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
