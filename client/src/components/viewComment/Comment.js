import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import usePeople from '../../logic/usePeople';
import style from './comment.module.css'
const Comment = ({document}) => {
    const my_api = process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";

    const [userInfo, setUserInfo] = useState(null)
    const [profilePhoto, setProfilePhoto] = useState(null)
    const {getUserInfo} = usePeople()
    useEffect(() => {
        const fetchUser = async () => {
            const fetched_user = await getUserInfo(document.comment_by)
          if(fetched_user){
            setUserInfo(fetched_user)

            const profile_photo_url = my_api + "/photos/" + fetched_user.photo
            let temp_image = new Image()
            temp_image.onload = () => {
                setProfilePhoto(profile_photo_url)
            }
            temp_image.src = profile_photo_url
          }
        }
        fetchUser()
    
    }, []);
    if(userInfo !== null) return (
        <div className = {style.comment}>
            <div className = {style.commentProfile}>
                {profilePhoto !== null? 
                <img src = {profilePhoto} className = {style.profilePhoto}/>:
                <FaUserCircle className = {style.tempProfilePhoto}/>
                }
            </div>
            <div className = {style.commentBody}>
            <div className = {style.commentHeader}>
                <p className = {style.commentOwner}>{userInfo.firstname + " " + userInfo.lastname}</p>
                <p className = {style.commentTime}>1h</p>
            </div>
            <div className = {style.commentContent}>
                {document.content}
            </div>
            </div>
        </div>
    );
    else return (null)
}
export default Comment;
