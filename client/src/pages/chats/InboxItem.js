import React, {useEffect, useState, setChats, id} from "react";
import { FaUser, FaUserCircle, FaUsers } from "react-icons/fa";
import style from './styles/chat.module.css'
import { MY_API } from "../../config";
import axios from "axios";
const InboxItem = ({chat, setRoom, setOnread, chats, setChats, id  }) => {
    const message = chat.last_sender.message
    const name = chat.isgroup?chat.name:chat.recipient.firstname + " " + chat.recipient.lastname
    const roomId = chat._id
    const [photoUrl, setPhotoUrl] = useState(null)
    const dateCreated = new Date(chat?.updatedAt)
    const chatDate = dateCreated.toDateString()
    const chatTime = dateCreated.toLocaleTimeString()
    const unread = !chat.seen

    useEffect(() => {
        const photo = chat.isgroup?MY_API + "/photo/"+chat.photo:MY_API + "/photo/"+chat.recipient.photo
        let preload = new Image()
        preload.onload = function(){
            setPhotoUrl(photo)
        }
        preload.src = photo
    }, [])
    const openChat = async() =>{
        if(chat.isgroup){
          setRoom({
            name:chat.name,
            room_id:chat._id,
            isgroup:chat.isgroup,
            photo:chat.photo,
            last_sender:{
              message:chat.last_sender.message,
            },          
            updatedAt:chat?.updatedAt,
            seen:true
          })
        }else{
          setRoom({
            room_id:roomId,
            recipient:chat.recipient,
            last_sender:{
              message:chat.last_sender.message,
            },
            updatedAt:chat?.updatedAt ,
            seen:true
        })
        }
        setOnread(true)
        if(unread){
          const readMessage = await axios({
            url:MY_API+"/chat/read",
            method:'post',
            withCredentials:true,
            data:{room_id:roomId}
          })
          if(readMessage.status === 200){
            const chatCopy = chats
            chatCopy[id].seen = true
            setChats(chatCopy)
          }
        }
    }
  return (
    <>
      <div className={unread ? style.chatInbox : style.chatInboxRead} onClick = {openChat}>
        {photoUrl?<img className={style.chatPicture} alt="" src = {photoUrl}></img>:
        chat.isgroup?<FaUsers className = {style.chatPicture}/>:<FaUserCircle className = {style.chatPicture}/>
        }
        <div className={style.chatDetails}>
          <div className={style.header}>
            <p className={style.chatName}>{name}</p>
            <p className={style.chatStatus}>{chatTime + " : " +chatDate}</p>
          </div>
          <p className={style.chatContent}>"{message}"</p>
        </div>
      </div>
    </>
  );
};
export default InboxItem;