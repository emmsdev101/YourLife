import React, { useContext, useEffect, useState } from "react";
import myStyle from "./styles/conversation.module.css";
import {
  FaArrowLeft,
  FaCamera,
  FaEllipsisH,
  FaEllipsisV,
  FaImage,
  FaMinus,
  FaMinusCircle,
  FaMinusSquare,
  FaPaperPlane,
  FaUser,
  FaUserCheck,
  FaUserCircle,
  FaUserMd,
  FaUserMinus,
  FaUserPlus,
  FaUsers,
  FaUsersCog,
  FaUserTimes,
} from "react-icons/fa";
import { MY_API } from "../../config";
import axios from "axios";
import MessageItem from "./Message";
import { SocketContext } from "../../logic/socketHandler";
import User from "../../components/people/user";
import Loader from "../../components/Loader/Loader";
export default function Conversataion({
  userContext,
  setOpen,
  room,
  chatRooms,
  initChats,
  addRoom,
}) {
  const [messageInput, setMessageInput] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeRoom, setActiveRoom] = useState(room.room_id);
  const [sending, setSending] = useState(false);
  const [chatsLoaded, setChatsLoaded] = useState(false);
  const [menu, setMenu] = useState(false);
  const [seeMembers, setSeeMembers] = useState(false);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState([]);
  const [removeMember, setRemoveMember] = useState(false);
  const [openModal, setOpenModal] = useState(false)
  const [toRemove, setToRemove] = useState(null)
  const [removing, setRemoving] = useState(false)
  const [numMmebers, setNumMembers] = useState(0)
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
    console.log("chats loaded")
    if (chatsLoaded) {
      console.log("Joining room")
      socket.emit("join", activeRoom);

      socket.on("message", (msg) => {
        if (msg.sender_id !== userContext._id) {
          let chatsCopy = [
            msg,
            ...chats,
          ];
          setChats(chatsCopy);
          axios({
            url: MY_API + "/chat/read",
            method: "post",
            withCredentials: true,
            data: { room_id: activeRoom },
          });
        }
      });
    }
  }, [chats]);

  async function initRoom(room_id) {
    try {
      setChats([]);
      setLoading(true);
      const fetchRoom = await axios({
        method: "get",
        withCredentials: true,
        url: MY_API + "/chat/messages",
        params: { room: room_id||activeRoom },
      });
      if (fetchRoom.status === 200) {
        setChatsLoaded(true);
        setChats(fetchRoom.data.messages);
        setNumMembers(fetchRoom.data.num_members)
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const closeMe = () => {
    if (activeRoom) socket.emit("leave", activeRoom);
    setOpen(null);
    setActiveRoom(null);
  };
  const inputMessage = (e) => {
    setMessageInput(e.target.value);
  };
  const leave = async() => {
    try {
      const removeRequest = await axios({
        url:MY_API+"/chat/remove",
        method:'post',
        withCredentials:true,
        data:{room_id:activeRoom, user_id:userContext._id}
      })
      if(removeRequest.status === 200){
        const isRemoved = removeRequest.data
        console.log(isRemoved)
        if(isRemoved){
          initChats()
          closeMe()
        }
      }
    } catch (error) {
      console.log(error)
      setRemoving(false)
    }
  }
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
          const chatsCopy = [
            {
              message: sendRequest.data,
              isSender: true,
            },
            ...chats,
          ];

          setChats(chatsCopy);
          setSending(false);
          room.last_sender.message = messageInput;
          room._id = activeRoom;

          const newRoom = chatRooms.filter(({ _id }) => _id !== activeRoom);
          addRoom([room, ...newRoom]);
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
          initRoom(sendRequest.data.room_id)
          setSending(false);
          setChatsLoaded(true);
        }
      }
    } catch (error) {
      setSending(false);
      console.log(error);
    }
  };
  async function loadMembers() {
    setMembersLoading(true);
    setMembers([])
    const getMembers = await axios({
      url: MY_API + "/chat/members",
      method: "get",
      withCredentials: true,
      params: { room_id: activeRoom },
    });
    if (getMembers.status === 200) {
      const membersData = getMembers.data;
      if (Array.isArray(membersData)) {
        setMembers(membersData);
        setMembersLoading(false);
      }
    }
  }

  const openMenu = () => {
    setMenu(!menu);
  };
  const openMembers = () => {
    if (!seeMembers) {
      loadMembers();
    }
    setSeeMembers(!seeMembers);
    setRemoveMember(false)
  };
  const openRemoveMember = () => {
     if (!removeMember) {
       loadMembers();
     }
    setRemoveMember(!removeMember);
    setSeeMembers(!seeMembers);
  };
  const confirmRemove = async() => {
    console.log(toRemove)
    setRemoving(true)
    try {
      const removeRequest = await axios({
        url:MY_API+"/chat/remove",
        method:'post',
        withCredentials:true,
        data:{room_id:activeRoom, user_id:toRemove}
      })
      if(removeRequest.status === 200){
        const isRemoved = removeRequest.data
        console.log(isRemoved)
        if(isRemoved){
          if(toRemove === userContext._id){
            initChats()
            closeMe()
          }else{
            loadMembers()
          setRemoving(false)
          initChats()
          initRoom()
          setOpenModal(!openModal)
          }
        }
      }
    } catch (error) {
      console.log(error)
      setRemoving(false)
    }
  }
  const toggleRemoveMember = (data) => {
    if(!toRemove){
      setToRemove(data._id)
    }else{
      setToRemove(null)
    }
    setOpenModal(!openModal)
  }
  const ModalAlert = ({message}) => {
    return (
      <div className = {myStyle.modalWrapper}>
        {removing?<div className = {myStyle.removing}><Loader/></div>:
        <div className={myStyle.modalAlert}>
        <div className={myStyle.modalHeader}>{message}</div>
        <div className={myStyle.modalBody}></div>
        <div className={myStyle.modalFooter}>
          <button className={myStyle.modalOk} onClick = {confirmRemove}>Confirm</button>
          <button className={myStyle.modalCancel} onClick = {toggleRemoveMember}>Cancel</button>
        </div>
      </div>}
      </div>
    );
  };
  if (menu) {
    if (seeMembers) {
      return (
        <div className={myStyle.menu}>
          {openModal?<ModalAlert message = {'Remove?'} list = {'sdfgsdf'}/>:''}
          <div className={myStyle.conversationMenu}>
            <div className={myStyle.conversationBack} onClick={openMembers}>
              <FaArrowLeft className={myStyle.backIcon}></FaArrowLeft>
            </div>
            <p className={myStyle.pageTitle}>
              {removeMember ? "Remove member" : "Members"}
            </p>
          </div>
          <div className={myStyle.membersList}>
            {members?.map((memberData, id) => (
              <User selectUser = {removeMember?toggleRemoveMember:''} data={memberData} id={id} isSearching={true} key = {id} page = {removeMember?'chat':''}/>
            ))}
            {membersLoading ? <Loader /> : ""}
          </div>
        </div>
      );
    } else {
      return (
        <div className={myStyle.menu}>
          <div className={myStyle.conversationMenu}>
            <div className={myStyle.conversationBack} onClick={openMenu}>
              <FaArrowLeft className={myStyle.backIcon}></FaArrowLeft>
            </div>
          </div>
          <div className={myStyle.conversationHeader}>
            {profilePhoto ? (
              <img
                className={myStyle.recieverPictureMenu}
                alt=""
                src={profilePhoto}
              ></img>
            ) : room.isgroup ? (
              <FaUsers className={myStyle.recieverPictureMenu} />
            ) : (
              <FaUserCircle className={myStyle.recieverPictureMenu} />
            )}
            <h3 className={myStyle.recieverNameMenu}>{name}</h3>
            <p className={myStyle.participantsNumber}> {numMmebers} People</p>
          </div>
          <div className={myStyle.menuOptions}>
            {room.isgroup ? (
              <button className={myStyle.menuButton} onClick={openMembers}>
                See group members <FaUsers className={myStyle.menuIcon} />{" "}
              </button>
            ) : (
              ""
            )}
            {room.isgroup ? (
              <button className={myStyle.menuButton}>
                Add person <FaUserPlus className={myStyle.menuIcon} />
              </button>
            ) : (
              <button className={myStyle.menuButton}>
                Delete conversation{" "}
                <FaMinusSquare className={myStyle.menuIcon} />
              </button>
            )}
            {room.isgroup ? (
              <button className={myStyle.menuButton} onClick={openRemoveMember}>
                Remove person <FaUserMinus className={myStyle.menuIcon} />
              </button>
            ) : (
              <button className={myStyle.menuButton}>
                View profile <FaUser className={myStyle.menuIcon} />
              </button>
            )}
            {room.isgroup ? (
              <button className={myStyle.menuButton}>Change group name </button>
            ) : (
              ""
            )}
            {room.isgroup ? (
              <button className={myStyle.menuButton}>
                Change group photo <FaImage className={myStyle.menuIcon} />
              </button>
            ) : (
              <button className={myStyle.menuButton}>
                Block <FaMinusCircle className={myStyle.menuIcon} />
              </button>
            )}
            {room.isgroup ? (
              <button className={myStyle.menuButton}>
                Leave group <FaMinusCircle className={myStyle.menuIcon} />{" "}
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      );
    }
  } else {
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
          <div className={myStyle.conversationBack} onClick={openMenu}>
            <FaEllipsisV></FaEllipsisV>
          </div>
        </div>
        {loading ? (
          <div className={myStyle.chatsLoading}>Loading chats</div>
        ) : (
          ""
        )}
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
}
