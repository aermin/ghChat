import React, {Component} from 'react';
import './style.scss';

export default class InputArea extends Component {
	constructor(props){
		super(props);
         	this.state = {
                inputMsg:""
             }
        }
        sendMessage = () =>{
            // this.props.inputMsgChange(this.state.inputMsg);
            this.props.sendMessage(this.state.inputMsg);
            this.state.inputMsg = '';
        }
        inputMsgChange = (event) =>{
            this.setState({
                inputMsg:event.target.value
            })
        }
        render() {
            return (
                <div className="input-msg">
                    <svg className="icon emoji" aria-hidden="true"><use  xlinkHref="#icon-smile"></use></svg>
                    <svg className="icon more" aria-hidden="true"><use  xlinkHref="#icon-more"></use></svg>
                    <textarea value={this.state.inputMsg} onChange={this.inputMsgChange}></textarea>
                    <p className="btn" onClick={this.sendMessage}>发送</p>
                </div>
            )
       }
}
