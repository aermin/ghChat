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

export default function reducer(state = initState, action) {
    console.log(state ,"====", action)
    switch (action.type) {
        case GET_ROBOT_MSG:
            return {
                ...state,
                message:state.robotMsg.push(action.data)
            };
        case INSERT_USER_MSG:
            return {
                ...state,
                message:state.robotMsg.push(action.data)            
            };
        default:
            return state;
        }
}