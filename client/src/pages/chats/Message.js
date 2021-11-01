import { FaUserCircle } from "react-icons/fa"
import myStyle from './styles/conversation.module.css'
import React, {useContext, useState, useEffect} from 'react'

import {GlobalUserContext} from "../../logic/userContext"
import { MY_API } from "../../config"
const MessageItem = ({id, chat}) => {
    const userContext = useContext(GlobalUserContext)
    const isme = chat.isSender
    const [profilePhoto, setProfilePhoto] = useState(null)

    const dateCreated = new Date(chat.message.createdAt)
    const chatDay = dateCreated.toDateString()
    const chatTime = dateCreated.toLocaleTimeString()
    useEffect(() => {
        setProfilePhoto(null)
        const photoUrl = isme? MY_API + "/photo/"+userContext.photo:MY_API + "/photo/"+chat.sender.photo
        let previewPhto = new Image()
        previewPhto.onload = function(){
            setProfilePhoto(photoUrl)
        }
        previewPhto.src = photoUrl
    }, [chat])
    if(isme){
        return(
            <div className = {myStyle.msgDivIsme} id = {id}>
                <div className = {myStyle.msgInnerIsme}>
                <p className = {myStyle.msgContent}>{chat.message.content}</p>
                <div className = {myStyle.messageFooter}>{chatDay + " " +  chatTime}</div>
                </div>
            {profilePhoto?<img className = {myStyle.msgProfilePic} alt = '' src = {profilePhoto}/>:
            <FaUserCircle className = {myStyle.msgProfilePic}/>}
            </div>
            )
    }else{
        return(
            <div className = {myStyle.msgDiv} id = {id}>
                {profilePhoto?<img className = {myStyle.msgProfilePic} src = {profilePhoto} alt = ''/>:
                <FaUserCircle className = {myStyle.msgProfilePic}/>}
                <div className = {myStyle.msgInner}>
                <p className = {myStyle.msgContent}>{chat.message.content}</p>
                <div className = {myStyle.messageFooter}>{chatDay + " " +  chatTime}</div>
                </div>
            </div>
            )
    }
}
export default MessageItem