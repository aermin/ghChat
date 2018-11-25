const UPDATE_ALL_CHAT_CONTENT = "UPDATE_ALL_CHAT_CONTENT";


 const updateAllChatContentByGotAction = async ({allChatContent, newChatContent, chatType}) => {
    const mapKey = chatType === 'privateChat' ? newChatContent.from_user : newChatContent.groupId;
    allChatContent[chatType].get(mapKey).privateDetail.push(newChatContent);
    return {
        type: UPDATE_ALL_CHAT_CONTENT,
        data: allChatContent
    }
 }

const updateAllChatContentBySentAction = async ({allChatContent, newChatContent, chatType}) => {
    const mapKey = chatType === 'privateChat' ? newChatContent.to_user : newChatContent.groupId;
    allChatContent[chatType].get(mapKey).privateDetail.push(newChatContent);
    return {
        type: UPDATE_ALL_CHAT_CONTENT,
        data: allChatContent
    }
 }

 export {
    UPDATE_ALL_CHAT_CONTENT,
    updateAllChatContentByGotAction,
    updateAllChatContentBySentAction
}