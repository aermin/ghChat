const GET_HOME_PAGE_LIST = "GET_HOME_PAGE_LIST";
const GET_ALL_CHAT_CONTENT = "GET_ALL_CHAT_CONTENT";


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
            element.time = element.time ? element.time : element.creater_time;
            element.id = element.group_id;
        });
        privateList.forEach(element => {
            element.type = "private";
            element.time = element.time ? element.time : element.be_friend_time;
            element.id = element.from_user;
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
            if (item.from_user) {
                res = await Request.axios('get', '/api/v1/private_chat', {
                    to_user: item.from_user
                });
                allChatContent.privateChat.set(item.from_user, res.data);
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

export {
    GET_HOME_PAGE_LIST,
    GET_ALL_CHAT_CONTENT,
    getHomePageListAction,
    getAllChatContentAction,
}
