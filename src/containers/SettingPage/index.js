import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Setting from '../../components/Setting';
import { initAppAction } from '../../redux/actions/initAppAction';
import { setGlobalSettingsAction } from './settingAction';

const mapStateToProps = state => ({
  globalSettings: state.globalSettingsState,
});

const mapDispatchToProps = dispatch => ({
  initApp(arg) {
    dispatch(initAppAction(arg));
  },
  setGlobalSettings(arg) {
    dispatch(setGlobalSettingsAction(arg));
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Setting));
