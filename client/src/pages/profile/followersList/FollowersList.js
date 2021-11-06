import React, { useContext } from 'react';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import Loader from '../../../components/Loader/Loader';
import { GlobalUserContext } from '../../../logic/userContext';
import Follower from './Follower';
import style from './followersList.module.css'
import useFollowersList from './useFollowersList';
const FollowersList = ({isOwn, back, numFollowers,numFollowing, fullname, viewFollowers}) => {
    const user_context = useContext(GlobalUserContext)
    const {followers, loading, searchInput, toSearch, loadingNext, nextPage, isSearching} = useFollowersList(isOwn, viewFollowers)

    return (
        <div className = {style.followersList}>
            <div className = {style.heading}>
                <div className = {style.back} onClick = {back}>
                    <FaArrowLeft className = {style.backIcon}/>
                </div>
                <p className = {style.name}>{fullname}</p>
            </div>
            <p className = {style.searchLabel}>Search:</p>
            <div className = {style.search}>
                <input type = "text" placeholder = "Search follower" className = {style.searchInput} onChange = {searchInput} value = {toSearch}/>
                <div className = {style.searchBUtton}/>
                    <FaSearch className = {style.searchIcon}/>
            </div>
            <div className = {style.listHeader}>
                <p className = {style.listLabel}>{viewFollowers === 'followers'?'Followers':'Following'}</p>
                <p className = {style.followerCount}>{viewFollowers === 'followers'?numFollowers:numFollowing}</p>
            </div>
            <div className = {style.list}>
                {followers? followers.map((user, id)=>(
                    <Follower noButton = {viewFollowers === "following"} isSearching = {isSearching} user = {user} key = {id} style = {style} isOwn ={isOwn} back = {back}/>
                )) :''
                }
                {loading?<div className = {style.loadingDiv}><Loader/></div>:followers?.length<numFollowers && !isSearching?<button className = {style.loadMore} onClick = {nextPage}>Load more</button>:followers?.length === 0?<div>No Result</div>:''}
                
            </div>
            
        </div>
    );
}

export default FollowersList;
