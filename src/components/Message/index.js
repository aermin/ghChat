import React, { Component } from "react";
import './style.scss';

export default class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow:false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("23333333333");
    if( this.props === nextProps || this.state === nextState){
      console.log("4544444");   
      return true
    }
    return false 
  }
  componentDidUpdate(){
    this.setState ({
      isShow:this.props.isShow
    })
    console.log("this.state.isShow ", this.state.isShow )
    this.close();
  }
  close(){
    window.setTimeout(() => {
      // this.setState({
      //   isShow:false
      // })
      console.log("this.state.isShow(close)",this.state.isShow)
    }, 3000);
  }

  render() {
    return (
      <div>
        {this.state.isShow && <div className="tips">
        {/* {this.props.type ===  'success' && 
          <svg className="icon" aria-hidden="true" style="font-size : 0.2rem">
              <use xlink:href="#icon-success1" />
            </svg>}
        {this.props.type ===  'warn' &&  <svg className="icon" aria-hidden="true" style="font-size : 0.2rem">
              <use xlink:href="#icon-warn1" />
            </svg>}
        {this.props.type ===  'error' && <svg className="icon" aria-hidden="true" style="font-size : 0.2rem">
              <use xlink:href="#icon-error1" />
            </svg>} */}
            {this.props.content}
          </div>}
      </div>  

    );
  }
}
