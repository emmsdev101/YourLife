import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import usePeople from '../../../logic/usePeople';

const Follower = ({style, user, back}) => {
    const history = useHistory()
    const my_api =
    process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";
    const {follow} = usePeople()
    
    const [follower, setFollowed] = useState(user.followed)
    const fullname = user.firstname + user.lastname
    const [profilePiture, setProfilePicture] = useState(null)
    
    useEffect(() => {
        const src = my_api + "/photo/" + user.photo
        let image = new Image()
        image.onload = () => {
        setProfilePicture(src)
        }
        image.src = src

        console.log(user)
    }, []);

    const reqFollow = () => {
        follow(user.username)
        setFollowed(!follower)
    }
    const viewProfile = () => {
        history.push("/profile/"+user.username)
        back()
    }
    
    return (
        <div className = {style.follower}>
            {profilePiture? <img className = {style.picture} src = {profilePiture} onClick = {viewProfile} alt = ''/>:
            <FaUserCircle className = {style.picture} onClick = {viewProfile}/>}
            <p className = {style.followerName} onClick = {viewProfile} >{fullname}</p>
            <button className = {follower? style.unfollowBtn:style.followBtn} onClick = {reqFollow}>{follower? "Unfollow":"Follow"}</button>
        </div>
    );
}

export default Follower;
