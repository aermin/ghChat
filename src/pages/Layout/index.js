import React, {Component} from 'react';
import HomePageList from '../HomePageList/index'
import './style.scss'


export default class Layout extends Component {
	constructor(){
		super();

         	this.state = {}
        }

        render() {
            return (
                <div className = 'layout-wrapper'>
                       <div className = 'layout-left'>
                            <HomePageList />
                       </div>
                       <div className= 'layout-right'>

                       </div>
                </div>
            )
       }
}

// export default connect(state => ({
//     robotMsg: state.robot.robotMsg
//   }), {
//     getRobotMsg,
//     insertUserMsg
//   })(Layout);