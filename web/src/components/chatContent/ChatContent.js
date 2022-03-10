import React, { Component, useState, createRef, useEffect } from "react";
import axios from "axios";
import ingUrl from './raheel.jpeg'
import "./chatContent.css";
import Avatar from "../chatList/Avatar";
import ChatItem from "./ChatItem";


export default class ChatContent extends Component {
  messagesEndRef = createRef(null);
  chatItms=[]
  constructor(props) {
    super(props);
    this.state = {
     
      chat: this.chatItms,
      msg: "",
    };
  }
  
  scrollToBottom = () => {
    this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  
  componentDidMount() {
    window.addEventListener("click", (e) => {
      console.log(e);
      if (e.pointerType=== "mouse") {
        if (this.state.msg != "") {
          
          
        
        }
      }
    });
    this.scrollToBottom();
  }
  onStateChange = (e) => {
    this.setState({ msg: e.target.value });
  };
  // =======================
   

  sendMessage =async () =>{
    // Make a request for a user with a given ID
    this.chatItms.push({
      key: 1,
      type: "",
      msg: this.state.msg,
      image:"https://pbs.twimg.com/profile_images/1116431270697766912/-NfnQHvh_400x400.jpg",
    });
    this.setState({ chat: [...this.chatItms] });
    this.scrollToBottom();
    try {
      const response = await axios.post('https://chatapp-saylani.herokuapp.com/api/df_text_query', {
        text: this.state.msg
      });
       this.chatItms.push({
          key: 1,
          type: "other",
          msg: response.data.fulfillmentText,
          image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",

        });
        this.setState({ chat: [...this.chatItms] });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
    
     
  }

  checkkey (e){
    if(e.keyCode===13){
      this.sendMessage()
    }else{
      console.log("this is Error");
    }
  }

  render() {
    return (
      <div className="main__chatcontent">
        <div className="content__header">
          <div className="blocks">
            <div className="current-chatting-user">
              <Avatar
                isOnline="active"
                image={ingUrl}
              />
              <p>Raheel</p>
            </div>
          </div>

          <div className="blocks">
            <div className="settings">
              <button className="btn-nobg">
                <i className="fa fa-cog"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="content__body">
          <div className="chat__items">
            {this.state.chat.map((itm, index) => {
              return (
                <ChatItem
                  animationDelay={index + 2}
                  key={itm.key}
                  user={itm.type ? itm.type : "me"}
                  msg={itm.msg}
                  image={itm.image}
                />
              );
            })}
            <div ref={this.messagesEndRef} />
          </div>
        </div>
        <div className="content__footer">
          <div className="sendNewMessage">
            <button className="addFiles">
              <i className="fa fa-plus"></i>
            </button>
            <input
              type="text"
              placeholder="Type a message here"
              onChange={(e)=>this.onStateChange(e)}
              value={this.state.msg}
        
            />
            <button className="btnSendMsg" id="sendMsgBtn" onClick={(e)=>this.sendMessage()}>
              <i className="fa fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
