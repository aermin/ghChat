import * as qiniu from 'qiniu';
import configs from '@configs';

export function getUploadToken() {
  const { accessKey, secretKey, bucket } = configs.qiniu;
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

  const options = {
    scope: bucket,
  };

  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);

  console.log('uploadToken', uploadToken);
  return uploadToken;
}
