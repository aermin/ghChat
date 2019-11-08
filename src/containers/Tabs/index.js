import { connect } from 'react-redux';
import Tabs from '../../components/Tabs';
import { initAppAction } from '../../redux/actions/initAppAction';

const mapStateToProps = state => ({
  initializedApp: state.initAppState,
});

const mapDispatchToProps = dispatch => ({
  initApp(arg) {
    dispatch(initAppAction(arg));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);
