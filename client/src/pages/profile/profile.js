
import './profile.css'
import ChangeDp from './../../components/changeDp/changeDp'
import Post from '../../components/post/post'
import { useCustomHooks, useIcons, useReactHooks } from '../../logic/library'
import  FriendItem  from "./friend";
import React, { useRef } from 'react';
import CreatePost from '../../components/createPost/createPost';
function Profile(){
    const {Cookies, useHistory, useContext, useState, useEffect} = useReactHooks()
    const {GlobalUserActionsContext, GlobalUserContext, usePeople, useFeed} = useCustomHooks()

    const {FaUserCircle, FaBars, FaPlusCircle, FaEnvelope, FaCamera,FaArrowLeft, FaUserPlus,FaPen} = useIcons()
    const owner = new Cookies().get("username")
    const my_api = process.env.NODE_ENV === 'development'? 'http://localhost:4000' : ''
    let isOwn =  true
    const history = useHistory()
    const user_context = useContext(GlobalUserContext);
    const set_user_context = useContext(GlobalUserActionsContext)

    const [photos, setPhotos] = useState(null);
    const [upload, setUpload] = useState(false)
    const {fetchPhotos, getFollowing, getFollowStatus} = usePeople()
    const {feedStories, addFeed, getMyStory} = useFeed()
    
    const fullname = user_context.firstname + ' ' +user_context.lastname
    const [profile_photo_url, setProfilePhotoUrl] = useState()
    const [follows, setFollows] = useState([])
    const [followStatus, setFollowStatus] = useState({})

    const [createPost, setCreatePost] = useState(false);

    const gender = user_context.gender
    const age = user_context.age
    
    let isMounted = useRef(true)

    useEffect(() => {
        if(user_context.username === undefined){
            set_user_context(owner)
        }
        async function fetchProfileData() {
            const following = await getFollowing()
            const followStat = await getFollowStatus()
            const fetchResult = await fetchPhotos(user_context.username)
            if(isMounted.current){
                getMyStory()
                setPhotos(fetchResult)
                setFollows(following)
                setFollowStatus(followStat)
                console.log(fetchResult)
            }
        }
        fetchProfileData()
        return(()=>{
            isMounted.current = false
        })
    }, []);
    useEffect(() => {
        let pp = new Image()
        pp.onload =()=>{
            if(isMounted.current){
                setProfilePhotoUrl(my_api + "/photos/"+user_context.photo)
            }
        }
        pp.src = my_api + "/photos/"+user_context.photo

        return(()=>{
            isMounted.current = false
        })
    }, [user_context]);

    function back(){
        history.push("/menu")
    }
    const uploadEnable = ()=> {
        setUpload(true)
    }
    const createStory = ()=>{
        if(createPost){
            setCreatePost(false)
        }else{
            setCreatePost(true)
        }
    }
    const PhtoItem =({image, id})=>{
        return(
            <div id = {id} className = "photo-item-div" style = {{backgroundImage:'url('+my_api+'/photos/'+image+')'}}>
            </div>
        )
    }
    
    const Avatar = () => {
        return(
            <div className = "dp-div">
                <img className = "avatar" src = {profile_photo_url}></img>
                {isOwn? <div className = "camera-div" onClick = {uploadEnable} >
                    <FaCamera/>
                </div>:''}
              </div>
        )
    }
    const TempAvatar = () => {
        return(
            <div className = "dp-div">
                <FaUserCircle className = "temp-avatar"/>
                {isOwn? <div className = "camera-div" onClick = {uploadEnable} >
                    <FaCamera/>
                </div>:''}
              </div>
        )
    }
    if(createPost)return(
        <CreatePost showMe = {createStory} addStory = {addFeed}/>
    )
    else return(
        <React.Fragment>
        {upload? <ChangeDp setUpload = {setUpload} setProfilePhotoUrl = {setProfilePhotoUrl} profile_photo_url = {profile_photo_url}/>:''}
      <div className = "profile-header-div">
          <div className = "row1-profile-header">
              <div className = "follower-div">
                  <p className = "follow-count">{user_context.followers}</p>
                  <p className = "follow-count-title">Followers</p>
              </div>
              {profile_photo_url !== undefined? <Avatar/>:<TempAvatar/>}
              <div className = "following-div">
                  <p className = "follow-count">{user_context.following}</p>
                  <p className = "follow-count-title">Following</p>
              </div>
          </div>
          <div className = "information-div">
              <p className = "fullname">{fullname}</p>
              <p className = "gender">{gender}</p>
              <p className = "age">{age}</p>
          </div>
          {!isOwn? <div className = "profile-action">
              <button className = "button-follow"> <FaUserPlus className = "follow-icon"></FaUserPlus> Follow</button>
              <button className = "button-message"> <FaEnvelope className = "message-icon"></FaEnvelope> Message</button>
          </div>:''}
        </div>
        {isOwn? <div className = "editprofile-div">
            <button> <FaPen className= "edit-icon"></FaPen> Edit Profile</button>
        </div>:''}
        <div className = "photos-div">
            <h4>Photos</h4>
            <div className = "photo-list-div">
                {photos !== null? photos.map((image, id)=>(
                    <PhtoItem image = {image.path} key = {id} id = {id}/>
                )):''}
            </div>
            <div className = "generic-button-div">
            <button> See more</button>
        </div>
        </div>
        <div className = "friends-div">
            <h4>Following</h4>
            <div className = "friends-list-div">
                {follows.map((user, id)=>(
                    <FriendItem username = {user.following} key ={id} id = {id}/>
                ))}
            </div>
            <div className = "generic-button-div">
            <button> See more followers</button>
        </div>
        </div>
        <h2 className = "section-title">  Stories</h2>
        {isOwn?  <div className = "primary-button">
            <button onClick = {createStory}> <FaPlusCircle className = "primary-button-icon" ></FaPlusCircle>Share a story</button>
        </div>:''}

        <div className = "stories-div">
            <div className = "post-div-list">
            {feedStories === null ?<div className = "loader-div"><div className="loader"></div></div>:''}
            
            {feedStories !== null && feedStories.length === 0?<>
                <h2>You have no story</h2>
                <h3>Share something in your life</h3>
            </>:''}
            {feedStories !== null? feedStories.map((story, id) => (
                <Post content = {story} key = {id} id = {id}/>
            )):''}
            </div>
        </div>
        </React.Fragment>
    )
    
}

export default Profile