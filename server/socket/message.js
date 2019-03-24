const msgModel = require('../models/message');
const privateChatModel = require('../models/privateChat');
const userModel = require('../models/userInfo');
const groupChatModel = require('../models/groupChat');


const getPrivateMsg = async ({
  toUser, user_id, start = 1, count = 20
}) => {
  const RowDataPacket1 = await privateChatModel.getPrivateDetail(user_id, toUser, start - 1, count);
  const RowDataPacket2 = await userModel.getUserInfo(toUser);
  const messages = JSON.parse(JSON.stringify(RowDataPacket1));
  const userInfo = JSON.parse(JSON.stringify(RowDataPacket2));
  return {
    messages,
    userInfo: userInfo[0]
  };
};

const getGroupItem = async ({ groupId, start = 1, count = 20 }) => {
  const RowDataPacket1 = await groupChatModel.getGroupMsg(groupId, start - 1, count);
  const RowDataPacket2 = await groupChatModel.getGroupInfo([groupId, null]);
  const RowDataPacket3 = await groupChatModel.getGroupMember(groupId);
  const members = JSON.parse(JSON.stringify(RowDataPacket3));
  const messages = JSON.parse(JSON.stringify(RowDataPacket1));
  const groupInfo = JSON.parse(JSON.stringify(RowDataPacket2))[0];
  return {
    messages,
    groupInfo: { ...groupInfo, members }
  };
};

const getAllMessage = async ({ user_id, clientHomePageList }) => {
  try {
    const res1 = await msgModel.getPrivateList(user_id);
    const privateList = JSON.parse(JSON.stringify(res1));
    const res2 = await msgModel.getGroupList(user_id);
    const groupList = JSON.parse(JSON.stringify(res2));
    const homePageList = groupList.concat(privateList);
    const privateChat = new Map();
    const groupChat = new Map();
    if (homePageList && homePageList.length) {
      for (const item of homePageList) {
        if (clientHomePageList && clientHomePageList.length) {
          const goal = clientHomePageList.find(e => (e.user_id ? e.user_id === item.user_id : e.to_group_id === item.to_group_id));
          if (goal) {
            const sortTime = goal.time;
            const res = item.user_id ? await privateChatModel.getUnreadCount({ sortTime, from_user: user_id, to_user: item.user_id })
              : await groupChatModel.getUnreadCount({ sortTime, to_group_id: item.to_group_id });
            item.unread = goal.unread + JSON.parse(JSON.stringify(res))[0].unread;
          }
        }
        if (item.user_id) {
          const data = await getPrivateMsg({ toUser: item.user_id, user_id });
          privateChat.set(item.user_id, data);
        } else if (item.to_group_id) {
          const data = await getGroupItem({ groupId: item.to_group_id });
          groupChat.set(item.to_group_id, data);
        }
      }
    }

    return {
      homePageList,
      privateChat: Array.from(privateChat),
      groupChat: Array.from(groupChat)
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};


module.exports = {
  getAllMessage,
  getPrivateMsg,
  getGroupItem,
};
