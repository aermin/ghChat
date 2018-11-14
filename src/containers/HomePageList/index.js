import HomePageList from '../../components/HomePageList'
import { connect } from 'react-redux';
import { getHomePageListAction } from "./getHomePageListAction";

const mapStateToProps = (state)=> ({
    homePageList : state.homePageListState
})

const mapDispatchToProps = (dispatch)=> ({
    getHomePageList: async () => {
        dispatch(await getHomePageListAction())
    } 
})

export default connect(mapStateToProps, mapDispatchToProps)(HomePageList);