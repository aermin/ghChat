import React, { Component } from 'react';
import './style.scss';

export default class ChatItem extends Component {
    constructor() {
        super();

        this.state = {}
    }
    // lookInfo(){
    //     console.log('href',this.props.href)
    //     // this.$router.push(`/user_info/${this.props.href}`)
    //     this.props.history.push("/login");

    // }
    render() {
        return (
                <div className="chat-item">
                    {!this.props.me && <div className="otherchat">
                        <img src={this.props.img} alt="" className="img" />
                        <div className="nt">
                            {this.props.name && <span>{ this.props.name }</span>}
                            {this.props.time && <span>{ this.props.time }</span>}
                        </div>
                        <div className="msg">{this.props.msg}</div>
                    </div>
                    }
                    {this.props.me && <div className="mychat">
                        <img src={this.props.img}  alt="" className="img" onClick={this.lookInfo}/>
                            <div className="nt">
                            {this.props.time && <span>{this.props.time}</span>}
                            {this.props.name && <span>{this.props.name}</span>}
                            </div>
                            <div className="msg">{this.props.msg}</div>
                    </div>}
                </div>
        )
    }
}