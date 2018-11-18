export const GET_ROBOT_MSG = "robot/GET_ROBOT_MSG";
export const INSERT_MSG = "robot/INSERT_MSG";
import Request from '../../api/request'

export const insertMsgAction = data => ({
      type: INSERT_MSG,
      data
})

export const getRobotMsgAction = async (data)=> {
        let finalData = {};
        const res= await Request.getRobotMsg(data);
        const { text, code, url } = res && res.data;
        if (code === 100000) {
            finalData = {
                message: text,
                user: "robot"
            }
        } else if (code === 200000) {
            finalData = {
                message: text + url,
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