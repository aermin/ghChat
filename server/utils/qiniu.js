const qiniu = require('qiniu');
const secret = require('../../secret');

function getUploadToken() {
  const { accessKey, secretKey, bucket } = secret.qiniu;
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);


  const options = {
    scope: bucket,
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);
  console.log('uploadToken', uploadToken);
  return uploadToken;
}


module.exports = getUploadToken;
