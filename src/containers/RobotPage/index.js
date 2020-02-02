import { connect } from 'react-redux';
import { getRobotMsgAction, insertMsgAction } from './robotAction';
import Robot from '../../components/Robot';

const mapStateToProps = state => ({
  robotState: state.robotState,
});

const mapDispatchToProps = dispatch => ({
  insertMsg(data) {
    dispatch(insertMsgAction(data));
  },
  async getRobotMsg(data) {
    dispatch(await getRobotMsgAction(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Robot);
