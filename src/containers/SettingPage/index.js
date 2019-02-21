import {
  withRouter
} from 'react-router-dom';
import { connect } from 'react-redux';
import Setting from '../../components/Setting';
import { initAppAction } from '../../utils/InitApp/initAppAction';

const mapDispatchToProps = dispatch => ({
  initApp(arg) {
    dispatch(initAppAction(arg));
  }
});

export default withRouter(connect(null, mapDispatchToProps)(Setting));
