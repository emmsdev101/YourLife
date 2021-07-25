import React, { useContext } from 'react';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import Loader from '../../../components/Loader/Loader';
import { GlobalUserContext } from '../../../logic/userContext';
import Follower from './Follower';
import style from './followersList.module.css'
import useFollowersList from './useFollowersList';
const FollowersList = ({isOwn, back, numFollowers}) => {
    const user_context = useContext(GlobalUserContext)
    const {followers, loading} = useFollowersList(isOwn)

    return (
        <div className = {style.followersList}>
            <div className = {style.heading}>
                <div className = {style.back} onClick = {back}>
                    <FaArrowLeft className = {style.backIcon}/>
                </div>
                <p className = {style.name}>{user_context.firstname +" "+ user_context.lastname}</p>
            </div>
            <p className = {style.searchLabel}>Search:</p>
            <div className = {style.search}>
                <input type = "text" placeholder = "Search follower" className = {style.searchInput}/>
                <div className = {style.searchBUtton}/>
                    <FaSearch className = {style.searchIcon}/>
            </div>
            <div className = {style.listHeader}>
                <p className = {style.listLabel}>Followers</p>
                <p className = {style.followerCount}>{numFollowers}</p>
            </div>
            <div className = {style.list}>
                {loading?<Loader/>:
                followers? followers.map((user, id)=>(
                    <Follower user = {user} key = {id} style = {style} isOwn ={isOwn}/>
                )) :''
                }
            </div>
            
        </div>
    );
}

export default FollowersList;
