module.exports = function requestFrequency(limitCount, timeStamp, socketId, io) {
  const nowTimeStamp = Date.parse(new Date());
  if (nowTimeStamp - timeStamp > 60000) { // more than 60 seconds
    limitCount = {};
    timeStamp = nowTimeStamp;
    return false;
  } // less than 60 seconds
  if (limitCount[socketId] > 60) {
    io.to(socketId).emit('error', { code: 429, message: '接口访问频繁，请一分钟后再试' });
    return true;
  }
  limitCount[socketId] = (limitCount[socketId] || 0) + 1;
  return false;
};
