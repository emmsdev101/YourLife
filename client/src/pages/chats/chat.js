import style from "./styles/chat.module.css";
import Conversation from "./Conversataion";
import { useIcons, useReactHooks } from "../../logic/library";
import React, { useEffect } from "react";

import CreateChat from "./CreateChat";
import axios from "axios";
import { MY_API } from "../../config";
import InboxItem from "./InboxItem";
import Loader from "../../components/Loader/Loader";
import { FaPeopleArrows, FaUsers } from "react-icons/fa";
function Chat({ chats, setChats, initChats }) {
  const { useHistory, useState } = useReactHooks();
  const { FaArrowLeft, FaPen, FaSearch } = useIcons();
  const history = useHistory();
  const [onread, setOnread] = useState(false);
  const [newMessage, setNewMessage] = useState(false);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isGroup, setIsGroup] = useState(false);

  useEffect(() => {
  }, [onread])
  function switchPage(page) {
    history.push(page);
  }
  const createNewMessage = () => {
    setIsGroup(false);
    setNewMessage(!newMessage);
  };
  const createNewGroup = () => {
    setIsGroup(true);
    setNewMessage(!newMessage);
  };
  const Inbox = () => {
    return (
      <>
        <header className={style.chatHeader}>
          <div className={style.chatNav}>
            <nav
              onClick={() => {
                switchPage("/");
              }}
            >
              <FaArrowLeft className={style.backIcon}></FaArrowLeft>
            </nav>
            <h3 className={style.pageTitle}>Chats</h3>
            <button className={style.newMessage} onClick={createNewMessage}>
              New Message
              <div className={style.iconDiv}>
                <FaPen className={style.newMessageIcon}></FaPen>
              </div>
            </button>
            <button className={style.newMessage} onClick={createNewGroup}>
              New Group
              <div className={style.iconDiv}>
                <FaUsers className={style.newMessageIcon}></FaUsers>
              </div>
            </button>
          </div>
          <div className={style.searchHolder}>
            <div className={style.chatSearch}>
              <input
                className={style.chatInput}
                type="text"
                placeholder="Search:"
              ></input>
              <FaSearch></FaSearch>
            </div>
          </div>
        </header>
        <div className={style.chatBody}>
          {chats?.map((chat, id) => (
            <InboxItem
              chat={chat}
              key={id}
              setRoom={setRoom}
              setOnread={setOnread}
              id = {id}
              chats = {chats}
              setChats = {setChats}
            />
          ))}
          {loading ? (
            <div className={style.loaderDiv}>
              <Loader />
            </div>
          ) : (
            ""
          )}
        </div>
      </>
    );
  };
  return (
    <>
      {onread ? (
        <Conversation setOpen={setOnread} room={room} initChats ={initChats} addRoom = {setChats} chatRooms = {chats} />
      ) : newMessage ? (
        <CreateChat
          setNewMessage={setNewMessage}
          isGroup={isGroup}
          style={style}
          setOnread={setOnread}
          setRoom={setRoom}
          initChats = {initChats}
        />
      ) : (
        <Inbox />
      )}
    </>
  );
}
export default Chat;
