import {GET_ROBOT_MSG , INSERT_USER_MSG }  from '../actions/robot';

const initState  = {
    robotMsg: [
        // 机器人首语
        {
            message: "hi , 欢迎与我聊天，问我问题哦！",
            user: "robot"
        }
    ]
}

export default function reducer(state = initState.robotMsg, action) {
    switch (action.type) {
        case GET_ROBOT_MSG:
            state.push(action.data);
            return [...state];
        case INSERT_USER_MSG:
             state.push(action.data);
             return [...state];
        default:
            return state;
        }
}