import style from "./styles/chat.module.css";
import Conversation from "./Conversataion";
import { useIcons, useReactHooks } from "../../logic/library";
import React, { useContext, useEffect } from "react";

import CreateChat from "./CreateChat";
import axios from "axios";
import { MY_API } from "../../config";
import InboxItem from "./InboxItem";
import Loader from "../../components/Loader/Loader";
import { FaPeopleArrows, FaUsers } from "react-icons/fa";
import { GlobalUserContext } from "../../logic/userContext";
import { useParams } from "react-router";
function Chat({ chats, setChats, initChats, match: { url, params }, Router }) {
  const userContext = useContext(GlobalUserContext);
  const { useHistory, useState } = useReactHooks();
  const { FaArrowLeft, FaPen, FaSearch } = useIcons();
  const history = useHistory();
  const [newMessage, setNewMessage] = useState(false);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGroup, setIsGroup] = useState(false);
  const userId = params.chatId;
  const page = url.substring(0, 5);

  useEffect(() => {
    if (userId && page !== "/chat") initChatParams();
    async function initChatParams() {
      try {
        if (userId !== userContext._id) {
          const checkRoom = await axios({
            method: "get",
            url: MY_API + "/chat/isMember",
            withCredentials: true,
            params: { recipient: userId },
          });
          if (checkRoom.status === 200) {
            if (checkRoom.data.room) {
              setRoom({
                room_id: checkRoom.data.room._id,
                recipient: checkRoom.data.profile,
              });
            } else {
              setRoom({
                room_id: null,
                recipient: checkRoom.data.profile,
              });
            }
          }
          
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, []);
  function switchPage(page) {
    history.push(page);
  }
  const createNewMessage = () => {
    setIsGroup(false);
    setNewMessage(!newMessage);
    history.push(`${url}/create`);
  };
  const createNewGroup = () => {
    setIsGroup(true);
    setNewMessage(!newMessage);
    history.push(`${url}/create`);
  };
  return (
    <>
      {page !== "/chat" ? (
        room ? (
          <Conversation
            userContext={userContext}
            room={room}
            initChats={initChats}
            addRoom={setChats}
            chatRooms={chats}
          />
        ) : (
          <div className={style.splash}>
            <Loader />
          </div>
        )
      ) : (
        <>
          <Router
            exact
            path={`${url}/conversation`}
            render={(props) => (
              <Conversation
                {...props}
                userContext={userContext}
                room={room}
                initChats={initChats}
                addRoom={setChats}
                chatRooms={chats}
              />
            )}
          />
          <Router
            exact
            path={`${url}/create`}
            render={(props) => (
              <CreateChat
                {...props}
                userContext={userContext}
                setNewMessage={setNewMessage}
                isGroup={isGroup}
                style={style}
                setRoom={setRoom}
                initChats={initChats}
              />
            )}
          />
          <Router
            exact
            path={`${url}/`}
            render={() => (
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
                    <button
                      className={style.newMessage}
                      onClick={createNewMessage}
                    >
                      New
                      <div className={style.iconDiv}>
                        <FaPen className={style.newMessageIcon}></FaPen>
                      </div>
                    </button>
                    <button
                      className={style.newMessage}
                      onClick={createNewGroup}
                    >
                      Create
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
                      id={id}
                      chats={chats}
                      setChats={setChats}
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
            )}
          />
        </>
      )}
    </>
  );
}
export default Chat;
