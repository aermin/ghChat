import HomePageList from '../../components/HomePageList'
import { connect } from 'react-redux';

const mapStateToProps = (state)=> ({
    homePageList : state.homePageListState,
    allChatContent: state.allChatContentState
})


export default connect(mapStateToProps)(HomePageList);