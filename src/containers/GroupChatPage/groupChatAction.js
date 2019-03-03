const SET_ALL_GROUP_CHATS = 'SET_ALL_GROUP_CHATS';
const ADD_GROUP_MESSAGES = 'ADD_GROUP_MESSAGES';
const ADD_GROUP_INFO = 'ADD_GROUP_INFO';
const DELETE_GROUP_CHAT = 'DELETE_GROUP_CHAT';
const ADD_GROUP_MESSAGE_AND_INFO = 'ADD_GROUP_MESSAGE_AND_INFO';

const setAllGroupChatsAction = ({ data = new Map() }) => ({
  type: SET_ALL_GROUP_CHATS,
  data
});

const addGroupMessagesAction = ({
  allGroupChats, messages, message, groupId, inLazyLoading = false
}) => {
  const allGroupChatsCopy = new Map(allGroupChats);
  const goalGroupChat = allGroupChatsCopy.get(groupId);
  const originMessages = goalGroupChat && goalGroupChat.messages || [];
  const newMessages = messages || [message];
  if (goalGroupChat) {
    const finalMessages = inLazyLoading ? [...newMessages, ...originMessages] : [...originMessages, ...newMessages];
    allGroupChatsCopy.get(groupId).messages = finalMessages;
  } else {
    allGroupChatsCopy.set(groupId, { messages: newMessages });
  }
  return { type: ADD_GROUP_MESSAGES, data: allGroupChatsCopy };
};

const addGroupInfoAction = ({
  allGroupChats, member,
  members, groupId, groupInfo,
}) => {
  const membersArg = members || [member];
  const allGroupChatsCopy = new Map(allGroupChats);
  const goalGroupChat = allGroupChatsCopy.get(groupId);
  const originGroupInfo = goalGroupChat && goalGroupChat.groupInfo || {};
  const originMembers = originGroupInfo && originGroupInfo.members || [];
  const newGroupMembers = originMembers.filter(m => m.user_id === (member && member.user_id)).length === 0
    ? [...originMembers, ...membersArg] : originMembers;
  const newGroupInfo = groupInfo || { ...originGroupInfo, members: newGroupMembers };
  if (goalGroupChat) {
    allGroupChatsCopy.get(groupId).groupInfo = newGroupInfo;
  } else {
    allGroupChatsCopy.set(groupId, { groupInfo: newGroupInfo });
  }
  return { type: ADD_GROUP_INFO, data: allGroupChatsCopy };
};

const addGroupMessageAndInfoAction = ({
  allGroupChats, groupId, messages, message, member,
  members, groupInfo
}) => {
  const res = addGroupMessagesAction({
    allGroupChats, groupId, messages, message
  });
  const { data } = addGroupInfoAction({
    allGroupChats: res.data,
    groupId,
    member,
    members,
    groupInfo
  });
  return { type: ADD_GROUP_MESSAGE_AND_INFO, data };
};


const deleteGroupChatAction = ({
  allGroupChats, groupId
}) => {
  const allGroupChatsCopy = new Map(allGroupChats);
  const goalGroupChat = allGroupChatsCopy.get(groupId);
  if (goalGroupChat) {
    allGroupChatsCopy.delete(groupId);
  }
  return { type: DELETE_GROUP_CHAT, data: allGroupChatsCopy };
};

export {
  SET_ALL_GROUP_CHATS,
  ADD_GROUP_MESSAGES,
  DELETE_GROUP_CHAT,
  ADD_GROUP_INFO,
  ADD_GROUP_MESSAGE_AND_INFO,
  setAllGroupChatsAction,
  addGroupMessagesAction,
  deleteGroupChatAction,
  addGroupInfoAction,
  addGroupMessageAndInfoAction,
};
