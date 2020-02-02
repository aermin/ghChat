import request from '../../utils/request';
import notification from '../../components/Notification';

export const GET_ROBOT_MSG = 'robot/GET_ROBOT_MSG';
export const INSERT_MSG = 'robot/INSERT_MSG';

export const insertMsgAction = data => ({
  type: INSERT_MSG,
  data,
});

export const getRobotMsgAction = async data => {
  const response = await request.socketEmitAndGetResponse('robotChat', data, error => {
    notification('消息发送失败', 'error', 2);
  });
  const { text, code, url } = response;
  return {
    type: INSERT_MSG,
    data: {
      message: code === 200000 ? text + url : text,
      user: '机器人小R',
    },
  };
};
