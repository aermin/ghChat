const groupChatModel = require('../models/groupChat');

/**
 * 获取群资料
 * @param   groupMsg  群聊信息
 * @param   groupInfo  群资料
 * @param   message  消息
 * @param   name 用户名
 * @param   time  时间
 * @return
 */

const getGroupInfo = async (ctx, next) => {
  try {
    const RowDataPacket = await groupChatModel.getGroupInfo([ctx.query.groupId, ctx.query.groupName]);
    const groupInfo = JSON.parse(JSON.stringify(RowDataPacket));
    ctx.body = {
      success: true,
      data: {
        groupInfo
      }
    };
  } catch (error) {
    console.log(error);
  }
};


/**
 * 获取群聊相关内容
 * @param   groupMsg  群聊信息
 * @param   groupInfo  群资料
 * @param   message  消息
 * @param   name 用户名
 * @param   time  时间
 * @return
 */

const getGroupDetail = async (ctx, next) => {
  try {
    const groupId = ctx.query.groupId;
    const RowDataPacket1 = await groupChatModel.getGroupMsg(groupId);
    const RowDataPacket2 = await groupChatModel.getGroupInfo([groupId, null]);
    const RowDataPacket3 = await groupChatModel.getGroupMember(groupId);
    const groupMsg = JSON.parse(JSON.stringify(RowDataPacket1));
    const groupInfo = JSON.parse(JSON.stringify(RowDataPacket2));
    // const groupMember = JSON.parse(JSON.stringify(RowDataPacket3));
    // const newGroupMember = [];
    // groupMember.forEach((element) => {
    //   newGroupMember.push(element.group_member_id);
    // });
    // groupInfo.groupMember = groupMember;
    // console.log('groupInfo~', groupInfo);
    // console.log('newGroupMember',newGroupMember)
    ctx.body = {
      success: true,
      data: {
        groupMsg,
        groupInfo
      }
    };
  } catch (error) {
    console.log(error);
  }
};
/**
 * 存储群聊信息
 * @param   userId  用户id
 * @param   groupId 群id
 * @param   message  消息
 * @param   name 用户名
 * @param   time  时间
 * @return
 */
const saveGroupMsg = async (ctx, next) => {
  const userId = ctx.user_id;
  const groupId = ctx.request.body.groupId;
  const message = ctx.request.body.message;
  const name = ctx.request.body.name;
  const time = ctx.request.body.time;
  // console.log(userId,groupId,message,name,time)
  await groupChatModel.saveGroupMsg(userId, groupId, message, name, time)
    .then((result) => {
      console.log('saveGroupMsg11', result);
      if (result) {
        ctx.body = {
          success: true
        };
        console.log('保存群消息成功');
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
/**
 * 群添加成员并返回群成员
 * @param   userId  用户id
 * @param   groupId 群id
 * @return 群成员
 */
const addGroupUserRelation = async (ctx, next) => {
  const userId = ctx.user_id;
  const groupId = ctx.request.body.groupId;
  await groupChatModel.addGroupUserRelation(userId, groupId);
  const RowDataPacket = await groupChatModel.getGroupMember(groupId);
  const groupMember = JSON.parse(JSON.stringify(RowDataPacket));
  const newGroupMember = [];
  groupMember.forEach((element) => {
    newGroupMember.push(element.group_member_id);
  });

  ctx.body = {
    success: true,
    data: {
      groupMember: newGroupMember
    }
  };
  console.log('添加群成员成功');
};

module.exports = {
  getGroupInfo,
  getGroupDetail,
  saveGroupMsg,
  addGroupUserRelation
};
