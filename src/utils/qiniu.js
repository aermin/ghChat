import * as qiniu from 'qiniu-js';

export default async function upload(file, uploadToken, completeEvent) {
  // subscription.unsubscribe(); // 上传取消
  const observer = {
    next(res) {
      // console.log('qiniu observer next', res);
    },
    error(err) {
      // console.log('qiniu observer err', err);
      return err;
    },
    complete(res) {
      // console.log('qiniu observer complete', res);
      const fileUrl = `https://cdn.aermin.top/${res.key}`;
      completeEvent(fileUrl);
    },
  };

  const config = { useCdnDomain: true };
  const putExtra = {};
  const { user_id } = JSON.parse(localStorage.getItem('userInfo'));
  const key = `${user_id}_${new Date().getTime()}_${file.name}`;
  const observable = qiniu.upload(file, key, uploadToken, putExtra, config);
  const subscription = observable.subscribe(observer); // 上传开始
}
