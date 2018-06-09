import React, {Component} from 'react';
import './style.scss';


export default class MessageBox extends Component {
	constructor(props){
		super(props);
             this.state = {}
             console.log("props",props);
        }
        cancel = () => {
            this.props.closeMessageBox();
        }
        confirm = () => {
            this.props.confirm(this.props.messageBoxEvent);
        }
        render() {
            return (
                <div>
                    {this.props.visible && <div className="message-box" >
                        <div className="bg"></div>
                        <div className="message-box-wrapper">
                            <h1> {this.props.title} </h1>
                            {/* <input v-if="canInput" type="text" v-model="canInputText" maxlength="10" placeholder="最多10个字哦"> */}
                            {/* <form className="editor-info" v-if="canEditorInfo">
                                <div className="">
                                    <span>github:</span><input type="text" v-model="myInfo.github">
                                </div>
                                <div className="">
                                    <span>website:</span><input type="text" v-model="myInfo.website">
                                </div>
                                <div className="info-sex">
                                    <span>性别:</span>
                                    <select v-model="myInfo.sex">
                                <option disabled value="">性别</option>
                                <option>男</option>
                                <option>女</option>
                                </select>
                                </div>
                                <div className="">
                                    <span>来自:</span><input type="text" v-model="myInfo.place" maxlength="12">
                                </div>
                            </form> */}
                            {/* <p v-else className="content">
                                <slot name="content"></slot>
                            </p> */}
                             <p className="content">
                               {this.props.content}
                            </p>
                           {this.props.hasCancel ? (
                           <div  className="hasCancel">
                                <p onClick={this.cancel}>取消</p>
                                <p onClick={this.confirm}>确定</p>
                            </div>) : (
                            <div className="noCancel">
                                <p onClick={this.confirm}>确定</p>
                            </div>)
                            }
                        </div>


                    </div>}
                </div> 
            )
       }
}