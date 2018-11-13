import {connect} from 'react-redux';
import {getRobotMsgAction , insertMsg} from "./action";
import Robot from '../../components/Robot'

const mapStateToProps = (state) => {
    return {
        robotState: state.robotState
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        insertMsg: (data) => {
            dispatch(insertMsg(data))
        },
        getRobotMsg: async (data) => {
            dispatch(await getRobotMsgAction(data))
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Robot);