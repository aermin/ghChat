import AxiosHandle from './axiosHandle';

export default class Request extends AxiosHandle{
  constructor(){
    super();
  }
    // async register (params = {}){
    //     try{ 
    //         let result = await this.axios('post', '/api/v1/register', params); 
    //         if(result && result.success){
    //           return result;
    //         }else{
    //           let err = {
    //             tip: '上传图片失败',
    //             response: result,
    //             data: params,
    //             url: 'http://cangdu.org:8001/v1/addimg/shop',
    //           }
    //           throw err;
    //         }
    //       }catch(err){
    //         throw err;
    //       }
    // }
  static async getRobotMsg (params = {}) {
     try {
        const response = await super.axiosRequest('get', '/api/v1/robot', params);
        return response;
     } catch (error) {
       console.error(error);
     }
   }
}