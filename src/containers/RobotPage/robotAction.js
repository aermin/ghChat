import request from '../../utils/request';
import notification from '../../components/Notification';

export const GET_ROBOT_MSG = 'robot/GET_ROBOT_MSG';
export const INSERT_MSG = 'robot/INSERT_MSG';

export const insertMsgAction = data => ({
  type: INSERT_MSG,
  data
});

export const getRobotMsgAction = async (data) => {
  let finalData = {};
  const response = await request.socketEmitAndGetResponse('robotChat', data, (error) => {
    notification('消息发送失败', 'error', 2);
  });
  const { text, code, url } = response;
  if (code === 100000) {
    finalData = {
      message: text,
      user: '机器人小R'
    };
  } else if (code === 200000) {
    finalData = {
      message: text + url,
      user: '机器人小R'
    };
  } else {
    finalData = {
      message: '暂不支持此类对话',
      user: '机器人小R'
    };
  }
  return {
    type: INSERT_MSG,
    data: finalData
  };
};
