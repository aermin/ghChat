import {GET_ROBOT_MSG , INSERT_MSG }  from './robotAction';

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
    switch (action.type) {
        case INSERT_MSG:
             state.push(action.data);
             return [...state];
        default:
            return state;
        }
}