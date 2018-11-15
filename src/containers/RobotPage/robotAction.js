export const GET_ROBOT_MSG = "robot/GET_ROBOT_MSG";
export const INSERT_MSG = "robot/INSERT_MSG";
import axios from "axios";

export const insertMsgAction = data => ({
      type: INSERT_MSG,
      data
})

export const getRobotMsgAction = (data)=> {
        let finalData = {};
        return axios.get("/api/v1/robot", {
            params: data
        }).then(res => {
            if (res) {
                const { data } = res.data;
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
                return {
                    type: INSERT_MSG,
                    data: finalData
                }
            }
        })
        .catch(err => {
            console.log(err);
        });
}