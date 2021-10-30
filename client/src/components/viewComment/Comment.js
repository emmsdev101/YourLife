import userEvent from '@testing-library/user-event';
import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import usePeople from '../../logic/usePeople';
import { MY_API } from '../../config';
import style from './comment.module.css'
const Comment = ({document}) => {
    const my_api = MY_API
    const history = useHistory()
    const [dpLoaded, setDpLoaded] = useState(false)

    const fullname = document.firstname + ' ' + document.lastname
    const profile_photo_url =  my_api + "/photo/" + document.photo
    const content = document.comment_content

    const postDate = new Date(document.date)
    const dateNow = new Date()
  
    const dateDiff = dateNow.getTime() - postDate.getTime()
    const daysLapsed = Math.trunc(dateDiff / (1000 * 3600 * 24))
    const hoursLapsed = Math.trunc(dateDiff / (1000 * 3600))
    const minutesLapsed = Math.trunc(dateDiff / (1000 * 60))
    
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
    const viewProfile = () => {
        history.push("/profile/"+document.username)
    }
    return (
        <div className = {style.comment}>
            <div className = {style.commentProfile}>
                {dpLoaded? 
                <img src = {profile_photo_url} className = {style.profilePhoto} onClick = {viewProfile} alt = ''/>:
                <FaUserCircle className = {style.tempProfilePhoto} onClick = {viewProfile}/>
                }
            </div>
            <div className = {style.commentBody}>
            <div className = {style.commentHeader}>
                <p className = {style.commentOwner} onClick = {viewProfile}>{fullname}</p>
            </div>
            <p className = {style.commentContent}>
                {content}
            </p>
            <p className = {style.commentTime}>
            {daysLapsed>0?daysLapsed>1?daysLapsed+" days ago":"Day ago":
                hoursLapsed>0?hoursLapsed>1?hoursLapsed + " hours ago":hoursLapsed+" hour ago":
                minutesLapsed>0?minutesLapsed>1?minutesLapsed + "minutes ago":minutesLapsed+" minute ago":
                "just now"
                }
            </p>
            </div>
            
        </div>
    );
}
export default Comment;
