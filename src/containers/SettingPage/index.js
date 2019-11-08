import {
  withRouter
} from 'react-router-dom';
import { connect } from 'react-redux';
import Setting from '../../components/Setting';
import { initAppAction } from '../../redux/actions/initAppAction';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  initApp(arg) {
    dispatch(initAppAction(arg));
  }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Setting));
