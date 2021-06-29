import { FaArrowLeft, FaBars, FaBell, FaEnvelope, FaEnvelopeSquare, FaHome, FaPen, FaSearch, FaUsers } from "react-icons/fa";
import './style.css'
import Post from '../../components/post/post'
import mylove from '../../res/images/mylove.jpg'
import mylove1 from '../../res/images/mylove1.jpg'
import User from '../../components/people/user'
import image1 from '../../res/images/mylove.jpg'
import './style.css'
import { BrowserRouter, Link, useHistory } from "react-router-dom";
import { useState, useEffect } from 'react';

import Conversation from "../Conversation/conversation";
function Chat(){
    const history = useHistory()
    const [onread, setOnread] = useState(false);

    function switchPage(page){
        history.push(page)
    }
const InboxItem = ({unread}) => {

    return(<>
        <div className = {unread? "chat-inbox unread":"chat-inbox"} onClick = {()=>{setOnread(true)}}>
            <img className = "chat-picture" src = {image1}></img>
            <div className = "chat-detail">
                <p className = "chat-name">Jonalyn Garder</p>
                <p className = "chat-content">Gwapo ungoy koba</p>
                <p className = "chat-status">1 hour ago</p>
            </div>
        </div>

    </>)
}
const Inbox = ()=> {
    return(
        <>
        <header className="chat-header">
            <div className = "chat-nav">
                <nav onClick = {()=>{switchPage("/")}}><FaArrowLeft className = "back-icon"></FaArrowLeft></nav>
                <h3 className = "page-title">Chats</h3>
                <nav className = "new-message"><FaPen></FaPen></nav>
                </div>
      </header>
      <div className = "search-holder">
            <div className = "chat-search">
                <input className = "chat-input" type = "text" placeholder = "Search:"></input>
                <FaSearch></FaSearch>
            </div>
    </div>
      <div className = "chat-body">

        <InboxItem unread = {true}></InboxItem>
        <InboxItem></InboxItem>
        <InboxItem unread = {true}></InboxItem>
        <InboxItem unread = {true}></InboxItem>
        <InboxItem unread = {true}></InboxItem>
        <InboxItem unread = {true}></InboxItem>
        <InboxItem unread = {true}></InboxItem>
        <InboxItem unread = {true}></InboxItem>
        <InboxItem unread = {true}></InboxItem>
        <InboxItem unread = {true}></InboxItem>
        <InboxItem unread = {true}></InboxItem>
        <InboxItem unread = {true}></InboxItem>
      </div>
        </>
        
    )
}
    return(
        <>
        {onread?<Conversation setOpen = {setOnread}/>:
        <Inbox/>}
        
</>
    )
}
export default Chat