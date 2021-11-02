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
        console.log(chat)
        if(chat.type !== 'notification'){
            setProfilePhoto(null)
            const photoUrl = isme? MY_API + "/photo/"+userContext.photo:MY_API + "/photo/"+chat.sender.photo
            let previewPhto = new Image()
            previewPhto.onload = function(){
                setProfilePhoto(photoUrl)
            }
            previewPhto.src = photoUrl
        }
    }, [chat])
    if(isme){
        if(chat.type === 'notification'){
            const fullname = chat.message.person?.firstname +" "+ chat.message.person?.lastname
            const content = chat.message.content
            const message = chat.details
            return(
                <div className = {myStyle.notification}>
                    <div className = {myStyle.notificationDate}>{chatTime + " | " + chatDay}</div>
                    <div className = {myStyle.notificationContent}><p className = {myStyle.notificationMessage}>{"You " + content}</p>
                    <p className = {myStyle.notificationProfile}>{fullname}</p>
                    <p className = {myStyle.notificationMessage}>{message}</p>
                    </div>
    
                </div>
            )
        }else{
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
        }
    }else{
        if(chat.type === 'notification'){
            const fullname = chat.message.person?.firstname +" "+ chat.message.person?.lastname
            const content = chat.message.content
            const message = chat.details
            const senderName = chat.sender.firstname +" "+  chat.sender.lastname
            return(
                <div className = {myStyle.notification}>
                    <div className = {myStyle.notificationDate}>{chatTime + " | " + chatDay}</div>
                    <p className = {myStyle.notificationProfile}>{senderName}</p>
                    <div className = {myStyle.notificationContent}><p className = {myStyle.notificationMessage}>{content === 'left'?message:content}</p>
                    <p className = {myStyle.notificationProfile}>{content === 'left'?'':fullname}</p>
                    <p className = {myStyle.notificationMessage}>{content === 'left'?'':message}</p>
                    </div>
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
}
export default MessageItem