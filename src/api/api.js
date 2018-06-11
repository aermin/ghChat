import Server from './server';

class API extends Server{
    async register (params = {}){
        try{
            let result = await this.axios('post', '/api/v1/register', params); 
            if(result && result.success){
              return result;
            }else{
              let err = {
                tip: '上传图片失败',
                response: result,
                data: params,
                url: 'http://cangdu.org:8001/v1/addimg/shop',
              }
              throw err;
            }
          }catch(err){
            throw err;
          }
    }

}