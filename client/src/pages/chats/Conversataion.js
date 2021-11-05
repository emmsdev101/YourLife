import React, { useContext, useEffect, useState } from "react";
import myStyle from "./styles/conversation.module.css";
import {
  FaArrowLeft,
  FaCamera,
  FaEllipsisH,
  FaEllipsisV,
  FaImage,
  FaMinusCircle,
  FaMinusSquare,
  FaPaperPlane,
  FaSearch,
  FaUser,
  FaUserCircle,
  FaUserMinus,
  FaUserPlus,
  FaUsers,
  FaWindowClose,
} from "react-icons/fa";
import { MY_API } from "../../config";
import axios from "axios";
import MessageItem from "./Message";
import { SocketContext } from "../../logic/socketHandler";
import User from "../../components/people/user";
import Loader from "../../components/Loader/Loader";
import usePeople from "../../logic/usePeople";
import ChangeDp from "../../components/changeDp/changeDp";
import { useHistory, useParams } from "react-router";
export default function Conversataion({
  userContext,
  setOpen,
  room,
  chatRooms,
  initChats,
  addRoom,
}) {
  const { getFollowed, searchPeople } = usePeople();
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
  const [openModal, setOpenModal] = useState(false);
  const [toRemove, setToRemove] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [numMmebers, setNumMembers] = useState(0);
  const [addMember, setAddMember] = useState(false);
  const [membersToAdd, setMembersToAdd] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [leaveGroup, setLeaveGroup] = useState(false);
  const isNew = room.room_id ? false : true;
  const [changePhoto, setChangePhoto] = useState(false);
  
  const name = room.isgroup
    ? room.name
    : room.recipient?.firstname + " " + room.recipient?.lastname;
  const [profilePhoto, setProfilePhoto] = useState(null);

  const socket = useContext(SocketContext);
  const history = useHistory();

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
    if (chatsLoaded) {
      socket.emit("join", activeRoom);

      socket.on("message", (msg) => {
        if (msg.sender_id !== userContext._id) {
          let chatsCopy = [msg, ...chats];
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
  useEffect(() => {
    if (addMember) {
      async function getPeople() {
        setLoading(true);
        const peopleResult = await getFollowed();
        if (peopleResult) {
          setMembers(peopleResult);
        }
      }
      getPeople();
    }
  }, [addMember]);

  useEffect(() => {
    if (searchInput.length > 2) {
      requestSearch();
      async function requestSearch() {
        setMembersLoading(true);
        setMembers(null);
        const searchRequest = await searchPeople(searchInput);
        if (searchRequest) {
          setMembersLoading(false);
          setMembers(searchRequest);
        }
      }
    }
  }, [searchInput]);

  async function initRoom(room_id) {
    try {
      setChats([]);
      setLoading(true);
      const fetchRoom = await axios({
        method: "get",
        withCredentials: true,
        url: MY_API + "/chat/messages",
        params: { room: room_id || activeRoom },
      });
      if (fetchRoom.status === 200) {
        setChatsLoaded(true);
        setChats(fetchRoom.data.messages);
        setNumMembers(fetchRoom.data.num_members);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const closeMe = () => {
    if (activeRoom) socket.emit("leave", activeRoom);
    setOpen(false);
    setActiveRoom(null);
    history.goBack()
  };
  const inputMessage = (e) => {
    setMessageInput(e.target.value);
  };
  const toggleLeaveGroup = () => {
    setLeaveGroup(!leaveGroup);
  };
  const toggleAddMember = () => {
    setAddMember(!addMember);
  };
  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };
  const leave = async () => {
    try {
      setRemoving(true);
      const removeRequest = await axios({
        url: MY_API + "/chat/remove",
        method: "post",
        withCredentials: true,
        data: { room_id: activeRoom, user_id: userContext._id },
      });
      if (removeRequest.status === 200) {
        const isRemoved = removeRequest.data;
        if (isRemoved) {
          initChats();
          closeMe();
          setRemoving(false);
        }
      }
    } catch (error) {
      console.log(error);
      setRemoving(false);
    }
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
          initRoom(sendRequest.data.room_id);
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
    setMembers([]);
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
    setRemoveMember(false);
  };
  const openRemoveMember = () => {
    if (!removeMember) {
      loadMembers();
    }
    setRemoveMember(!removeMember);
    setSeeMembers(!seeMembers);
  };
  const confirmRemove = async () => {
    setRemoving(true);
    try {
      const removeRequest = await axios({
        url: MY_API + "/chat/remove",
        method: "post",
        withCredentials: true,
        data: { room_id: activeRoom, user_id: toRemove },
      });
      if (removeRequest.status === 200) {
        const isRemoved = removeRequest.data;
        if (isRemoved) {
          if (toRemove === userContext._id) {
            initChats();
            closeMe();
          } else {
            loadMembers();
            setRemoving(false);
            initChats();
            initRoom();
            setOpenModal(!openModal);
          }
        }
      }
    } catch (error) {
      console.log(error);
      setRemoving(false);
    }
  };
  const addMembersSelected = async () => {
    try {
      setRemoving(true);
      setOpenModal(true);
      const userIds = membersToAdd.map((participant) => {
        return { user_id: participant._id };
      });
      const addRequest = await axios({
        url: MY_API + "/chat/addToGroup",
        method: "post",
        withCredentials: true,
        data: { room_id: activeRoom, participants: userIds },
      });
      if (addRequest.status === 200) {
        setRemoving(false);
        setOpenModal(false);
        initRoom();
        toggleAddMember();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const toggleRemoveMember = (data) => {
    if (!toRemove) {
      setToRemove(data._id);
    } else {
      setToRemove(null);
    }
    setOpenModal(!openModal);
  };
  const addParticipant = (data) => {
    const exists = membersToAdd.find(({ _id }) => _id === data._id);
    if (!exists) {
      setMembersToAdd((added) => [...added, data]);
    }
  };
  const removeParticipant = (id) => {
    const toRemove = membersToAdd[id];
    const newmembersToAdd = membersToAdd.filter(
      ({ _id }) => _id !== toRemove._id
    );
    setMembersToAdd(newmembersToAdd);
  };
  const toggleChangePhoto = () => {
    setChangePhoto(!changePhoto);
  };
  const successChange = () => {
    initRoom()
    initChats()
  }
  const ModalAlert = ({ message, isPrompt }) => {
    return (
      <div className={myStyle.modalWrapper}>
        {removing ? (
          <div className={myStyle.removing}>
            <Loader />
          </div>
        ) : (
          <div className={myStyle.modalAlert}>
            <div className={myStyle.modalHeader}>{message}</div>
            <div className={myStyle.modalBody}>
              {isPrompt ? <input className={myStyle.ModalInput} /> : ""}
            </div>
            <div className={myStyle.modalFooter}>
              <button
                className={myStyle.modalOk}
                onClick={leaveGroup ? leave : confirmRemove}
              >
                Confirm
              </button>
              <button
                className={myStyle.modalCancel}
                onClick={leaveGroup ? toggleLeaveGroup : toggleRemoveMember}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  if (menu) {
    if (seeMembers || addMember) {
      return (
        <div className={myStyle.menu}>
          {openModal ? <ModalAlert message={"Remove?"} list={"sdfgsdf"} /> : ""}
          <div className={myStyle.memberHeader}>
            <div className={myStyle.conversationMenu}>
              <div
                className={myStyle.conversationBack}
                onClick={addMember ? toggleAddMember : openMembers}
              >
                <FaArrowLeft className={myStyle.backIcon}></FaArrowLeft>
              </div>
              <p className={myStyle.pageTitle}>
                {removeMember
                  ? "Remove member"
                  : addMember
                  ? "Add Member"
                  : "Members"}
              </p>
              {addMember ? (
                <button
                  className={myStyle.addMemberButton}
                  onClick={addMembersSelected}
                >
                  Add
                </button>
              ) : (
                ""
              )}
            </div>
            {addMember ? (
              <div>
                <div className={myStyle.searchHolder}>
                  <div className={myStyle.chatSearch}>
                    <input
                      className={myStyle.chatInput}
                      type="text"
                      placeholder="Search:"
                      value={searchInput}
                      onChange={handleSearch}
                    ></input>
                    <FaSearch></FaSearch>
                  </div>
                </div>
                <div className={myStyle.toAddDiv}>
                  {membersToAdd?.map((participant, id) => (
                    <div className={myStyle.participant} key={id}>
                      {participant.firstname}
                      <FaWindowClose
                        className={myStyle.removeParticipant}
                        onClick={() => {
                          removeParticipant(id);
                        }}
                      />
                    </div>
                  ))}
                  {!membersToAdd.length ? "Select participant" : ""}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className={myStyle.membersList}>
            {addMember
              ? members?.map((memberData, id) => (
                  <User
                    selectUser={addParticipant}
                    data={memberData}
                    id={id}
                    isSearching={true}
                    key={id}
                    page={"chat"}
                  />
                ))
              : members?.map((memberData, id) => (
                  <User
                    selectUser={removeMember ? toggleRemoveMember : ""}
                    data={memberData}
                    id={id}
                    isSearching={true}
                    key={id}
                    page={removeMember ? "chat" : ""}
                  />
                ))}
            {membersLoading ? <Loader /> : ""}
          </div>
        </div>
      );
    } else {
      return (
        <div className={myStyle.menu}>
          {changePhoto ? (
            <ChangeDp
              setUpload={toggleChangePhoto}
              setProfilePhotoUrl={setProfilePhoto}
              message={"Change Group Photo"}
              roomId = {activeRoom}
              page = {'chat'}
              onSuccess = {successChange}
              profile_photo_url = {profilePhoto}
            />
          ) : (
            ""
          )}
          {leaveGroup ? <ModalAlert message={"Leave Group?"} /> : ""}
          <div className={myStyle.conversationMenu}>
            <div className={myStyle.conversationBack} onClick={openMenu}>
              <FaArrowLeft className={myStyle.backIcon}></FaArrowLeft>
            </div>
          </div>
          <div className={myStyle.conversationHeader}>
            <div className={myStyle.roomPhotoDiv}>
              {" "}
              {profilePhoto ? (
                <img
                  className={myStyle.recieverPictureMenu}
                  alt=""
                  src={profilePhoto}
                ></img>
              ) : room.isgroup ? (
                <FaUsers className={myStyle.recieverAvatarMenu} />
              ) : (
                <FaUserCircle className={myStyle.recieverAvatarMenu} />
              )}
              <h3 className={myStyle.recieverNameMenu}>{name}</h3>
            </div>
          </div>
          <div className={myStyle.menuOptions}>
            {room.isgroup ? (
              <button className={myStyle.menuButton} onClick={openMembers}>
                See Members <FaUsers className={myStyle.menuIcon} />{" "}
              </button>
            ) : (
              ""
            )}
            {room.isgroup ? (
              <button className={myStyle.menuButton} onClick={toggleAddMember}>
                Add Member <FaUserPlus className={myStyle.menuIcon} />
              </button>
            ) : (
              <button className={myStyle.menuButton}>
                Delete Conversation{" "}
                <FaMinusSquare className={myStyle.menuIcon} />
              </button>
            )}
            {room.isgroup ? (
              <button className={myStyle.menuButton} onClick={openRemoveMember}>
                Remove Member <FaUserMinus className={myStyle.menuIcon} />
              </button>
            ) : (
              <button className={myStyle.menuButton}>
                View Profile <FaUser className={myStyle.menuIcon} />
              </button>
            )}
            {room.isgroup ? (
              <button className={myStyle.menuButton}>Change Group Name </button>
            ) : (
              ""
            )}
            {room.isgroup ? (
              <button
                className={myStyle.menuButton}
                onClick={toggleChangePhoto}
              >
                Change Group Photo <FaImage className={myStyle.menuIcon} />
              </button>
            ) : (
              <button className={myStyle.menuButton}>
                Block <FaMinusCircle className={myStyle.menuIcon} />
              </button>
            )}
            {room.isgroup ? (
              <button className={myStyle.menuButton} onClick={toggleLeaveGroup}>
                Leave Group <FaMinusCircle className={myStyle.menuIcon} />{" "}
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
