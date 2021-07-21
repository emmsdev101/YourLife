import userEvent from '@testing-library/user-event';
import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import usePeople from '../../logic/usePeople';
import style from './comment.module.css'
const Comment = ({document}) => {
    const my_api = process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";

    const [dpLoaded, setDpLoaded] = useState(false)

    const fullname = document.firstname + ' ' + document.lastname
    const profile_photo_url =  my_api + "/photos/" + document.photo
    const content = document.comment_content
    
    useEffect(() => {
        const preloadPicture = async () => {
            let temp_image = new Image()
            temp_image.onload = () => {
                setDpLoaded(true)
            }
            temp_image.src = profile_photo_url
        }
        preloadPicture()
        return () => {
            setDpLoaded(false)
        }
    }, []);
    return (
        <div className = {style.comment}>
            <div className = {style.commentProfile}>
                {dpLoaded? 
                <img src = {profile_photo_url} className = {style.profilePhoto}/>:
                <FaUserCircle className = {style.tempProfilePhoto}/>
                }
            </div>
            <div className = {style.commentBody}>
            <div className = {style.commentHeader}>
                <p className = {style.commentOwner}>{fullname}</p>
                <p className = {style.commentTime}>1h</p>
            </div>
            <div className = {style.commentContent}>
                {content}
            </div>
            </div>
        </div>
    );
}
export default Comment;
