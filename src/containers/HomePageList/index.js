import HomePageList from '../../components/HomePageList'
import { connect } from 'react-redux';
import { getHomePageListAction,  getAllChatContentAction} from "./getHomePageListAction";

const mapStateToProps = (state)=> ({
    homePageList : state.homePageListState,
    allChatContent: state.allChatContentState
})

const mapDispatchToProps = (dispatch)=> ({
    getHomePageList: async () => {
        dispatch(await getHomePageListAction())
    },
    getAllChatContent: async (homePageList) => {
        dispatch(await getAllChatContentAction(homePageList))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(HomePageList);