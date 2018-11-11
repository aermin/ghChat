import {GET_ROBOT_MSG , INSERT_USER_MSG }  from './action';

const initState  = {
    robotMsg: [
        // 机器人首语
        {
            message: "hi , 欢迎与我聊天，问我问题哦！",
            user: "robot"
        }
    ]
}

export default function RobotReducer(state = initState.robotMsg, action) {
    let finalData;
    switch (action.type) {
        case GET_ROBOT_MSG:
            if (action.data.code === 100000) {
                finalData = {
                    message:action.data.text,
                    user: "robot"
                }
            } else if (action.data.code === 200000) {
                finalData = {
                    message:action.data.text + action.data.url,
                    user: "robot"
                }
            } else {
                finalData = {
                    message: "暂不支持此类对话",
                    user: "robot"
                }
            }
            state.push(finalData);
            return [...state];
        case INSERT_USER_MSG:
             state.push(action.data);
             return [...state];
        default:
            return state;
        }
}