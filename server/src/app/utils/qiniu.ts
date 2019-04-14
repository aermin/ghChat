import * as qiniu from 'qiniu';
import { environment } from '@env';

export function getUploadToken() {
  const { accessKey, secretKey, bucket } = environment.secret.qiniu;
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);


  const options = {
    scope: bucket
  };

  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);

  console.log('uploadToken', uploadToken);
  return uploadToken;
}
