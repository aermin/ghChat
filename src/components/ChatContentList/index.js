
import React, { Component } from "react";
import ChatItem from '../ChatItem';
export default class ChatContentList extends Component {
	constructor(){
   super();
   this.state = {}
  }
  render() {
      console.log('this.props.chatId', this.props.chatId);
      const listItems = this.props.ChatContent.map((item,index) =>
          <li key={index}>
              {parseInt(this.props.chatId) === item.from_user ? <ChatItem me={true} img={item.avator} msg={item.message} name={item.name} time={item.time} />
              : <ChatItem img={item.avator}  msg={item.message} name={item.name} time={item.time} />}
          </li>
      );
      return (
        <div>
          <ul>
              {listItems}
          </ul>
        </div>
      )
  }
}

// const mapStateToProps = (state) => {

// }

// const mapDispatchToProps = (dispatch) => {
// }

// export default connect(mapStateToProps, mapDispatchToProps)(ChatContentList);