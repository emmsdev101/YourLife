import React, { useContext, useEffect, useState } from "react";
import myStyle from "./styles/conversation.module.css";
import {
  FaArrowLeft,
  FaCamera,
  FaEllipsisH,
  FaEllipsisV,
  FaImage,
  FaPaperPlane,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";
import { MY_API } from "../../config";
import axios from "axios";
import MessageItem from "./Message";
import { SocketContext } from "../../logic/socketHandler";
export default function Conversataion({userContext, setOpen, room, chatRooms, initChats, addRoom }) {
  const [messageInput, setMessageInput] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeRoom, setActiveRoom] = useState(room.room_id);
  const [sending, setSending] = useState(false);
  const [chatsLoaded, setChatsLoaded] = useState(false)
  const isNew = room.room_id ? false : true;
  const name = room.isgroup
    ? room.name
    : room.recipient?.firstname + " " + room.recipient?.lastname;
  const [profilePhoto, setProfilePhoto] = useState(null);

  const socket = useContext(SocketContext);

  useEffect(() => {
    if (activeRoom) {
      initRoom();
    }
    const photoUrl = room.isgroup
      ? MY_API + "/photo/" + room.photo
      : MY_API + "/photo/" + room.recipient?.photo;
    let previewPhto = new Image();
    previewPhto.onload = function () {
      setProfilePhoto(photoUrl);
    };
    previewPhto.src = photoUrl;
  }, []);

  useEffect(() => {
    if(chatsLoaded){
        socket.emit("join", room.room_id);

        socket.on("message", (msg) => {
          if (msg.sender_id !== userContext._id){
              let chatsCopy = [{
                message: msg.message,
                isSender: msg.isSender,
                sender:msg.sender
              }, ...chats]
                setChats(chatsCopy)
            axios({
                url: MY_API + "/chat/read",
                method: "post",
                withCredentials: true,
                data: { room_id: room.room_id },
              });
          }
    
        });
    }
  }, [chats])

  async function initRoom() {
    try {
      setChats([]);
      setLoading(true);
      const fetchRoom = await axios({
        method: "get",
        withCredentials: true,
        url: MY_API + "/chat/messages",
        params: { room: room.room_id },
      });
      if (fetchRoom.status === 200) {
        setChats(fetchRoom.data);
        setChatsLoaded(true)
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const closeMe = () => {
    if(activeRoom)socket.emit('leave', activeRoom)
    setOpen(null);
    setActiveRoom(null)
  };
  const inputMessage = (e) => {
    setMessageInput(e.target.value);
  };
  const sendMessage = async () => {
    try {
      setMessageInput("");
      setSending(true);
      if (activeRoom) {
        const sendRequest = await axios({
          method: "post",
          url: MY_API + "/chat/reply",
          withCredentials: true,
          data: { message: messageInput, room_id: activeRoom },
        });
        if (sendRequest.status === 200) {
            const chatsCopy = [           {
                message: sendRequest.data,
                isSender: true,
              },...chats]

          setChats(chatsCopy);
          setSending(false);
          room.last_sender.message = messageInput
          room._id=activeRoom

          const newRoom = chatRooms.filter(({_id})=> _id !== activeRoom )
          addRoom([room, ...newRoom])
          axios({
            url: MY_API + "/chat/read",
            method: "post",
            withCredentials: true,
            data: { room_id: room.room_id },
          });
        }
      } else {
        const sendRequest = await axios({
          method: "post",
          url: MY_API + "/chat/create",
          withCredentials: true,
          data: { message: messageInput, recipient: room.recipient._id },
        });
        if (sendRequest.status === 200) {
          setActiveRoom(sendRequest.data.room_id);
          setChats((oldChat) => [
            ...oldChat,
            {
              message: sendRequest.data,
              isSender: true,
            },
            
          ]);
          initChats();
          setSending(false);
        }
      }
    } catch (error) {
      setSending(false);
      console.log(error);
    }
  };

  return (
    <div className={myStyle.conversation}>
      <div className={myStyle.conversationNav}>
        <div className={myStyle.conversationBack} onClick={closeMe}>
          <FaArrowLeft className={myStyle.backIcon}></FaArrowLeft>
        </div>
        {profilePhoto ? (
          <img
            className={myStyle.recieverPicture}
            alt=""
            src={profilePhoto}
          ></img>
        ) : room.isgroup ? (
          <FaUsers className={myStyle.recieverPicture} />
        ) : (
          <FaUserCircle className={myStyle.recieverPicture} />
        )}
        <h3 className={myStyle.recieverName}>{name}</h3>
        <div className={myStyle.conversationBack}>
          <FaEllipsisV></FaEllipsisV>
        </div>
      </div>
      {loading ? <div className={myStyle.chatsLoading}>Loading chats</div> : ""}
      <div className={myStyle.convoBody}>
        {chats?.map((chat, id) => (
          <MessageItem chat={chat} key={id} />
        ))}
      </div>
      <div className={myStyle.messageInputs}>
        <div className={myStyle.photoDiv}>
          <FaCamera className={myStyle.photoIcon}></FaCamera>
        </div>
        <div className={myStyle.photoDiv}>
          <FaImage className={myStyle.photoIcon}></FaImage>
        </div>
        <textarea type="text" value={messageInput} onChange={inputMessage} />
        {sending ? (
          <div className={myStyle.sendBtn}>
            <FaEllipsisH className={myStyle.sendIcon} />
          </div>
        ) : (
          <button className={myStyle.sendBtn} onClick={sendMessage}>
            <FaPaperPlane className={myStyle.sendIcon}></FaPaperPlane>
          </button>
        )}
      </div>
    </div>
  );
}
