export const GET_ROBOT_MSG = "robot/GET_ROBOT_MSG";
export const INSERT_USER_MSG = "robot/USER_INPUT_MSG";
import axios from "axios";

export const insertUserMsg = data => {
    return {
      type: INSERT_USER_MSG,
      data
    }
}

export const getRobotMsg = data => {
      // 返回函数，异步dispatch
      console.log('getRobotMsg', data);
    return async dispatch => {
            axios.get("/api/v1/robot", {
                params: data
            }).then(res => {
                if (res) {
                    if (res.data.data.code === 100000) {
                        dispatch({
                            type: GET_ROBOT_MSG,
                            data:{
                                message:res.data.data.text,
                                user: "robot"
                            }
                          })
                    } else if (res.data.data.code === 200000) {
                        let message = res.data.data.text + res.data.data.url;
                        dispatch({
                            type: GET_ROBOT_MSG,
                            data:{
                                message: message,
                                user: "robot"
                            }
                          })
                    } else if (res.data.data.code === 302000) {
                        dispatch({
                            type: GET_ROBOT_MSG,
                            data:{
                                message: "暂不支持此类对话",
                                user: "robot"
                            }
                          })
                    } else {
                        dispatch({
                            type: GET_ROBOT_MSG,
                            data:{
                                message: "暂不支持此类对话",
                                user: "robot"
                            }
                          })
                    }
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
}