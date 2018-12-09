const newFriendsModel = require('../models/newFriends');

/**
 *  获取我的新好友通知
 * @param user_id  我的id
 * @return
 */

const getnewFriends = async (ctx, next) => {
  const RowDataPacket = await newFriendsModel.getnewFriends(ctx.user_id);
  const newFriends = JSON.parse(JSON.stringify(RowDataPacket));
  ctx.body = {
    success: true,
    data: {
      newFriends
    }
  };
};

/**
 *  添加我的新好友通知
 * @param
 * @return
 */

const insertNewFriends = async (ctx, next) => {
  const arr = [ctx.user_id, ctx.request.body.to_user, ctx.request.body.content, ctx.request.body.time, ctx.request.body.status];
  await newFriendsModel.insertNewFriends(arr).then((result) => {
    ctx.body = {
      success: true
    };
  }).catch((err) => {
    console.log(err);
  });
};

/**
 *  更新我的新好友通知状态
 * @param
 * @return
 */

const updateNewFriends = async (ctx, next) => {
  await newFriendsModel.updateNewFriends(ctx.request.body.from_user, ctx.user_id).then((result) => {
    console.log('updateNewFriends更新我的新好友通知状态成功');
    ctx.body = {
      success: true
    };
  }).catch((err) => {
    console.log(err);
  });
};

module.exports = {
  getnewFriends,
  insertNewFriends,
  updateNewFriends
};
