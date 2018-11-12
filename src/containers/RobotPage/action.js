export const GET_ROBOT_MSG = "robot/GET_ROBOT_MSG";
export const INSERT_USER_MSG = "robot/USER_INPUT_MSG";
import axios from "axios";

export const insertUserMsg = data => {
    return {
      type: INSERT_USER_MSG,
      data
    }
}

export const getRobotMsgAction = data => {
    return async (dispatch) => {
        console.log('data233', data);
        let finalData = {};
        axios.get("/api/v1/robot", {
            params: data
        }).then(res => {
        console.log('res', res);
            if (res) {
                const { data } = res.data;
                // dispatch(getRobotMsgAction(res.data.data))\
                if (data.code === 100000) {
                    finalData = {
                        message: data.text,
                        user: "robot"
                    }
                } else if (data.code === 200000) {
                    finalData = {
                        message: data.text + data.url,
                        user: "robot"
                    }
                } else {
                    finalData = {
                        message: "暂不支持此类对话",
                        user: "robot"
                    }
                }
            }
        })
        .catch(err => {
            console.log(err);
        });
        return {
            type: GET_ROBOT_MSG,
            data: finalData
        }
    }
    return {
        type: GET_ROBOT_MSG,
        data
    }
}