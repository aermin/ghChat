export const GET_HOME_PAGE_LIST = "homePageList/GET_HOME_PAGE_LIST";
import axios from "axios";

export const getHomePageList = data => {
      // 返回函数，异步dispatch
    return async dispatch => {
        const res = await axios.get("/api/v1/message");
			console.log("res", res);
			if (res.data.success) {
				const groupList = res.data.data.groupList;
				const privateList = res.data.data.privateList;
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
                dispatch({
                    type: GET_HOME_PAGE_LIST,
                    data:allMsgList
                  })
            }
    }
}