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
        axios.get("/api/v1/robot", {
            params: data
        }).then(res => {
            console.log('res', res);
                if (res) {
                    dispatch(getRobotMsgAction(res.data.data))
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
    return {
        type: GET_ROBOT_MSG,
        data
    }
}