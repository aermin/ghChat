import {connect} from 'react-redux';
import { updateAllChatContentByGotAction, updateAllChatContentBySentAction } from './privateChatAction';
import {
    withRouter,
  } from 'react-router-dom'

import PrivateChat from '../../components/PrivateChat'

const mapStateToProps = (state) => ({
    allChatContent: state.allChatContentState
})

const mapDispatchToProps = (dispatch)=> ({
    updateAllChatContentByGot: async ({allChatContent, newChatContent, chatType}) => {
        dispatch(await updateAllChatContentByGotAction({allChatContent,newChatContent,chatType}))
    },
    updateAllChatContentBySent: async ({allChatContent, newChatContent, chatType}) => {
        dispatch(await updateAllChatContentBySentAction({allChatContent,newChatContent,chatType}))
    }
})

export default  withRouter(connect(mapStateToProps, mapDispatchToProps)(PrivateChat));