const GET_HOME_PAGE_LIST = "GET_HOME_PAGE_LIST";
const GET_ALL_CHAT_CONTENT = "GET_ALL_CHAT_CONTENT";
const UPDATE_ALL_CHAT_CONTENT = "UPDATE_ALL_CHAT_CONTENT";


import Request from '../../utils/request';
import {
    toNomalTime
} from "../../utils/transformTime";

const getHomePageListAction = async () => {
    let res;
    try {
        res = await Request.axios('get', '/api/v1/message');
    } catch (error) {
        console.log(error);
    }
    if (res && res.success) {
        const { groupList, privateList } = res.data;
        groupList.forEach(element => {
            element.type = "group";
            element.time = element.time ? toNomalTime(element.time) : toNomalTime(element.creater_time);
            element.id = element.group_id;
        });
        privateList.forEach(element => {
            element.type = "private";
            element.time = element.time ? toNomalTime(element.time) : toNomalTime(element.be_friend_time);
            element.id = element.other_user_id;
            // element.unread = 0;
        });
        const allMsgList = groupList.concat(privateList);
        allMsgList.sort((a, b) => {
            return b.time - a.time;
        });
        return {
            type: GET_HOME_PAGE_LIST,
            data: allMsgList
        }
    }
    return {};
}

const getAllChatContentAction = async (homePageList) => {
    let allChatContent = { privateChat: new Map(), groupChat: new Map() };
    for (const item of homePageList) {
        try {
            let res;
            if (item.other_user_id) {
                res = await Request.axios('get', '/api/v1/private_chat', {
                    to_user: item.other_user_id
                });
                allChatContent.privateChat.set(item.other_user_id, res.data);
            } else if (item.group_id) {
                res = await Request.axios('get', '/api/v1/group_chat', {
                    groupId: item.group_id
                });
                allChatContent.groupChat.set(item.group_id, res.data);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return {
        type: GET_ALL_CHAT_CONTENT,
        data: allChatContent
    };
}

 const updateAllChatContentByGotAction = async ({allChatContent, newChatContent, chatType}) => {
    const mapKey = chatType === 'privateChat' ? newChatContent.from_user : newChatContent.groupId;
    allChatContent[chatType].get(parseInt(mapKey)).privateDetail.push(newChatContent);
    return {
        type: UPDATE_ALL_CHAT_CONTENT,
        data: allChatContent
    }
 }

const updateAllChatContentBySentAction = async ({allChatContent, newChatContent, chatType}) => {
    const mapKey = chatType === 'privateChat' ? newChatContent.to_user : newChatContent.groupId;
    allChatContent[chatType].get(parseInt(mapKey)).privateDetail.push(newChatContent);
    return {
        type: UPDATE_ALL_CHAT_CONTENT,
        data: allChatContent
    }
 }

export {
    GET_HOME_PAGE_LIST,
    GET_ALL_CHAT_CONTENT,
    UPDATE_ALL_CHAT_CONTENT,
    getHomePageListAction,
    getAllChatContentAction,
    updateAllChatContentByGotAction,
    updateAllChatContentBySentAction
}
