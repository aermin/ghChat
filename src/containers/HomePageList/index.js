import HomePageList from '../../components/HomePageList'
import { connect } from 'react-redux';
import {updateHomePageListAction} from './homePapeListAction';

const mapStateToProps = (state)=> ({
    homePageList : state.homePageListState,
    allChatContent: state.allChatContentState
})

const mapDispatchToProps = (dispatch) => ({
    updateHomePageList: (arg = {}) => {
        dispatch(updateHomePageListAction({...arg}));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(HomePageList);