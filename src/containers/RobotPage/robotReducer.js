import { GET_ROBOT_MSG, INSERT_MSG } from './robotAction';

const GROUP_CHAT_ID = 'ddbffd80-3663-11e9-a580-d119b23ef62e';

const initState = {
  robotMsg: [
    // 机器人首语
    {
      message: 'hi, 欢迎与我聊天，问我问题哦！也欢迎点击加入关于本项目的交流群进行交流 :grinning:',
      user: '机器人小R'
    },
    {
      message: `/group_chat/${GROUP_CHAT_ID}?name=ghChat&inviter=机器人小R`,
      user: '机器人小R'
    }
  ]
};

export default function RobotReducer(state = initState.robotMsg, action) {
  switch (action.type) {
    case INSERT_MSG:
      state.push(action.data);
      return [...state];
    default:
      return state;
  }
}
