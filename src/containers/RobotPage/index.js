import {connect} from 'react-redux';
import {getRobotMsgAction , insertMsg} from "./action";
import Robot from '../../components/Robot'

const mapStateToProps = (state) => ({
        robotState: state.robotState
})

const mapDispatchToProps = (dispatch) => ({
        insertMsg: (data) => {
            dispatch(insertMsg(data))
        },
        getRobotMsg: async (data) => {
            dispatch(await getRobotMsgAction(data))
        }
})


export default connect(mapStateToProps, mapDispatchToProps)(Robot);