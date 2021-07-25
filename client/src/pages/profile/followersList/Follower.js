import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import usePeople from '../../../logic/usePeople';

const Follower = ({style, user}) => {
    const my_api =
    process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";
    const {follow} = usePeople()
    
    const [follower, setFollowed] = useState(user.followed)
    const fullname = user.firstname + user.lastname
    const [profilePiture, setProfilePicture] = useState(null)
    
    useEffect(() => {
        const src = my_api + "/photos/" + user.photo
        let image = new Image()
        image.onload = () => {
        setProfilePicture(src)
        }
        image.src = src
    }, []);

    const reqFollow = () => {
        follow(user.username)
        setFollowed(!follower)
    }
    
    return (
        <div className = {style.follower}>
            {profilePiture? <img className = {style.picture} src = {profilePiture}/>:
            <FaUserCircle className = {style.picture}/>}
            <p className = {style.followerName}>{fullname}</p>
            <button className = {follower? style.unfollowBtn:style.followBtn} onClick = {reqFollow}>{follower? "Unfollow":"Follow"}</button>
        </div>
    );
}

export default Follower;
