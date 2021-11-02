import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaCrop, FaCross, FaMinus, FaPen, FaRegWindowClose, FaSearch, FaWindowClose, FaXing } from "react-icons/fa";
import User from "../../components/people/user";
import Loader from "../../components/Loader/Loader";
import myStyle from "./styles/createchat.module.css";
import usePeople from "../../logic/usePeople";
import {MY_API} from './../../config'
import axios from "axios";
function CreateChat({ style, setNewMessage, setOnread,setRoom, isGroup, initChats,userContext }) {
  const { getFollowed, searchPeople } = usePeople();
  const [loading, setLoading] = useState(false);
  const [people, setPeople] = useState([]);
  const [loadingRoom, setLoadingRoom] = useState(false)
  const [participants, setParticipants]= useState([])
  const [groupName, setGroupName] = useState('')
  const [searchInput, setSearchInput] = useState('')


  useEffect(() => {
    async function getPeople() {
      setLoading(true);
      const peopleResult = await getFollowed();
      console.log(peopleResult);
      if (peopleResult) {
        setPeople(peopleResult);
      }
    }
    getPeople();
  }, []);

  useEffect(() => {
    if(searchInput.length >= 2){
      setLoading(true)
      setPeople([])
      search()
      async function search(){
        const searchRequest = await searchPeople(searchInput)
        if(Array.isArray(searchRequest)){
          setPeople(searchRequest)
          setLoading(false)
        }else{
          setPeople([])
          setLoading(false)
        }
      }

    }
  }, [searchInput])

  const selectUser = async(data) => {
    console.log(data)

    try {
      if(data._id !== userContext._id){
        setLoadingRoom(true)
        const checkRoom = await axios({
          method:'get',
          url:MY_API + '/chat/isMember',
          withCredentials:true,
          params:{recipient:data._id}
        })
        if(checkRoom.status === 200){
          console.log(checkRoom.data)
          if(checkRoom.data){
            setRoom({
              room_id:checkRoom.data._id,
              recipient:data
            })
          }else{
            setRoom({
              room_id:null,
              recipient:data
            })
          }
          setLoadingRoom(false)
          setOnread(true)
          setNewMessage(false)
  
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  const createGroupChat = async() => {
    try{
      if(participants && groupName){
        setLoadingRoom(true)
        const userIds = participants.map((participant)=>{ return {user_id:participant._id}})

        const createRequest = await axios({
          method:'post',
          url:MY_API + '/chat/newGroup',
          withCredentials:true,
          data:{recipients:userIds, name:groupName}
        })
  
        if(createRequest.status === 200){
          if(createRequest.data){
            console.log(createRequest)
            setRoom({
              name:createRequest.data.name,
              room_id:createRequest.data._id,
              isgroup:createRequest.data.isgroup,
            })
            initChats()
            setLoadingRoom(false)
            setOnread(true)
            setNewMessage(false)
          }
        }
      }
    }catch(err){
      console.log(err)
    }
  }
  const closeMe = () => {
    setNewMessage(false)
  }
  const inputGroupName = (e)=> {
    setGroupName(e.target.value)
  }
  const addPariticipant = (data) => {
    const participatExists = participants.find(({_id})=>_id === data._id || data._id === userContext._id)
    if(!participatExists){
      setParticipants((olds)=>[...olds, data])
    }
  }
  const removeParticipant = (id) => {
    console.log(id)
    const toRemove = participants[id]
    const newParticipants = participants.filter(({_id})=>_id !== toRemove._id)
    setParticipants(newParticipants)
  }
  const handleSearch = (e) => {
    setSearchInput(e.target.value)
  }
  if(isGroup){
    return(
      <div className={myStyle.createChat}>
        {loadingRoom?<div className = {myStyle.loadingRoom}>
          <Loader/>
        </div>:''}
        <header className={myStyle.createGroupHeader}>
          <div className={style.chatNav}>
            <nav onClick={closeMe}>
              <FaArrowLeft className="back-icon"></FaArrowLeft>
            </nav>
            <h3 className={style.pageTitle}>New Group Chat</h3>
            <button className = {myStyle.createButton} onClick = {createGroupChat}>Create</button>
          </div>
          <div className = {myStyle.groupDetails}>
            Group Name :
          <input type = 'text' className = {myStyle.groupName} value = {groupName} onChange = {inputGroupName}/>
          Participants :
          <div className={style.searchHolder}>
          <div className={myStyle.chatSearch}>
            <input
              className={style.chatInput}
              type="text"
              placeholder="Search:"
              value = {searchInput}
              onChange = {handleSearch}
            ></input>
            <FaSearch></FaSearch>
          </div>
        </div>
          <div className = {myStyle.participants}>
            {participants?.map((participant, id)=>(
              <div className = {myStyle.participant} key = {id}>
              {participant.firstname}
              <FaWindowClose className = {myStyle.removeParticipant} onClick = {()=>{removeParticipant(id)}}/>
              </div>
            ))}
            {!participants.length?"Select participant":''}
          </div>
          </div>
        </header>
        <div className={myStyle.peopleList}>
          {people?.map((data, id) => (
            <User selectUser = {addPariticipant} data={data} id={id} isSearching={true} key = {id} page = {'chat'}/>
          ))}
          <br/>
          {loading ? <Loader /> : ""}
        </div>
      </div>
    )
  }else{
    return (
      <div className={myStyle.createChat}>
        {loadingRoom?<div className = {myStyle.loadingRoom}>
          <Loader/>
        </div>:''}
        <header className={style.chatHeader}>
          <div className={style.chatNav}>
            <nav onClick={closeMe}>
              <FaArrowLeft className="back-icon"></FaArrowLeft>
            </nav>
            <h3 className={style.pageTitle}>New Message</h3>
          </div>
          <div className={style.searchHolder}>
            <p className = {style.searchLabel}>To :</p>
          <div className={style.chatSearch}>
            <input
              className={style.chatInput}
              type="text"
              placeholder="Search:"
              value = {searchInput}
              onChange = {handleSearch}
            ></input>
            <FaSearch></FaSearch>
          </div>
        </div>
        </header>
        <div className={myStyle.peopleListNewMessage}>
          {people?.map((data, id) => (
            <User selectUser = {selectUser} data={data} id={id} isSearching={true} key = {id} page = {'chat'}/>
          ))}
          <br/>
          {loading ? <Loader /> : ""}
        </div>
      </div>
    );
  }
}
export default CreateChat;
