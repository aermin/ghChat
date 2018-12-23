const msgModel = require('../models/message');
const privateChatModel = require('../models/privateChat');
const userModel = require('../models/userInfo');
const groupChatModel = require('../models/groupChat');


async function getPrivateMsg({ toUser, userId }) {
  const RowDataPacket1 = await privateChatModel.getPrivateDetail(userId, toUser);
  const RowDataPacket2 = await userModel.getUserInfo(toUser);
  const privateDetail = JSON.parse(JSON.stringify(RowDataPacket1));
  const userInfo = JSON.parse(JSON.stringify(RowDataPacket2));
  return {
    privateDetail,
    userInfo: userInfo[0]
  };
}

async function getGroupMsg({ groupId }) {
  const RowDataPacket1 = await groupChatModel.getGroupMsg(groupId);
  const RowDataPacket2 = await groupChatModel.getGroupInfo([groupId, null]);
  const groupMsg = JSON.parse(JSON.stringify(RowDataPacket1));
  const groupInfo = JSON.parse(JSON.stringify(RowDataPacket2));
  return {
    groupMsg,
    groupInfo
  };
}

module.exports = async ({ userId }) => {
  try {
    const res1 = await msgModel.getPrivateList(userId);
    const privateList = JSON.parse(JSON.stringify(res1));
    const res2 = await msgModel.getGroupList(userId);
    const groupList = JSON.parse(JSON.stringify(res2));
    groupList.forEach((element) => {
      element.type = 'group';
      element.time = element.time ? element.time : element.create_time;
      element.id = element.group_id;
    });
    privateList.forEach((element) => {
      element.type = 'private';
      element.time = element.time ? element.time : element.be_friend_time;
      element.id = element.from_user;
    });
    const homePageList = groupList.concat(privateList);
    homePageList.sort((a, b) => b.time - a.time);
    const privateChat = new Map();
    const groupChat = new Map();
    for (const item of homePageList) {
      if (item.from_user) {
        const data = await getPrivateMsg({ toUser: item.from_user, userId });
        privateChat.set(item.from_user, data);
      } else if (item.group_id) {
        const data = await getGroupMsg({ groupId: item.group_id });
        groupChat.set(item.group_id, data);
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
