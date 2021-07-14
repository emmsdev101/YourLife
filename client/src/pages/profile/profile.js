
import './profile.css'
import testimage1 from '../../res/images/test1.jpg'
import testimage2 from '../../res/images/test2.jpg'
import testimage3 from '../../res/images/test3.jpg'
import testimage4 from '../../res/images/test4.jpg'

import ChangeDp from './../../components/changeDp/changeDp'
import Post from '../../components/post/post'
import { useCustomHooks, useIcons, useReactHooks } from '../../logic/library'

function Profile(){
    const {Cookies, useHistory, useContext, useState, useEffect} = useReactHooks()
    const {GlobalUserActionsContext, GlobalUserContext, usePeople} = useCustomHooks()

    const {FaUserCircle, FaBars, FaPlusCircle, FaEnvelope, FaCamera,FaArrowLeft, FaUserPlus,FaPen} = useIcons()
    const owner = new Cookies().get("username")
    const my_api = process.env.NODE_ENV === 'development'? 'http://localhost:4000' : ''
    let isOwn =  true
    const history = useHistory()
    const user_context = useContext(GlobalUserContext);
    const set_user_context = useContext(GlobalUserActionsContext)

    const [photos, setPhotos] = useState([]);
    const [upload, setUpload] = useState(false)
    const {fetchPhotos} = usePeople()
    
    const fullname = user_context.firstname + ' ' +user_context.lastname
    const followers = user_context.followers
    const following = user_context.followiing
    const [profile_photo_url, setProfilePhotoUrl] = useState()

    const gender = user_context.gender
    const age = user_context.age

    useEffect(() => {
        if(user_context.username === undefined){
            console.log("initializing")
            console.log(owner)
            set_user_context(owner)
        }
        async function setupPhotos (){
            const fetchResult = await fetchPhotos(user_context.username)
            setPhotos(fetchResult)
        }
        setupPhotos()
    }, []);
    useEffect(() => {
        setProfilePhotoUrl(my_api + "/photos/"+user_context.photo)
    }, [user_context]);

    function back(){
        history.push("/menu")
    }
    const uploadEnable = ()=> {
        setUpload(true)
    }
    const PhtoItem =({image, id})=>{
        return(
            <div id = {id} className = "photo-item-div" style = {{backgroundImage:'url('+my_api+'/photos/'+image+')'}}>
            </div>
        )
    }
    const FriendItem = ({image})=> {
        return(<>
                <div className = "friends-item-div">
                <div className = "friend-image" style = {{backgroundImage:'url('+image+')'}}>
            </div>
                    <p>Jasper Gequillio</p>
                </div>
        </>)
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
    
    return(
        <>
        {upload? <ChangeDp setUpload = {setUpload} setProfilePhotoUrl = {setProfilePhotoUrl} profile_photo_url = {profile_photo_url}/>:''}
        <header className="App-header">
        <div className = "back-btn-div" onClick = {()=>{back()}}>
          <FaArrowLeft className = "back-icon"/>
          </div>
          <div className = "menu-btn-div">
          <FaBars className = "menu-icon"/>
          </div>
      </header>
      <div className = "profile-header-div">
          <div className = "row1-profile-header">
              <div className = "follower-div">
                  <p className = "follow-count">{followers}</p>
                  <p className = "follow-count-title"> Followers</p>
              </div>
              {user_context.photo !== undefined? <Avatar/>:<TempAvatar/>}
              <div className = "following-div">
                  <p className = "follow-count">{following}</p>
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
                { photos.map((image, id)=>(
                    <PhtoItem image = {image.path} id = {id}/>
                ))}
            </div>
            <div className = "generic-button-div">
            <button> See more</button>
        </div>
        </div>
        <div className = "friends-div">
            <h4>Followers</h4>
            <div className = "friends-list-div">
                <FriendItem image = {testimage1}></FriendItem>
                <FriendItem image = {testimage2}></FriendItem>
                <FriendItem image = {testimage3}></FriendItem>
                <FriendItem image = {testimage4}></FriendItem>
                <FriendItem image = {testimage4}></FriendItem>
                <FriendItem image = {testimage4}></FriendItem>
            </div>
            <div className = "generic-button-div">
            <button> See more followers</button>
        </div>
        </div>
        <h2 className = "section-title">  Stories</h2>
        {isOwn?  <div className = "primary-button">
            <button> <FaPlusCircle className = "primary-button-icon"></FaPlusCircle>Share a story</button>
        </div>:''}

        <div className = "stories-div">
            <div className = "post-div-list">
            <Post content = "the quick brown fox jumps over the lazy dog and the dog got angy so the dog chased the brown fox. But the brown fox is quicker than the dog so the dog didn't catched the brown fox" hasphoto = {true}></Post>
            <Post content = "What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book it has?"></Post>
            <Post content = "the quick brown fox jumps over the lazy dog and the dog got angy so the dog chased the brown fox. But the brown fox is quicker than the dog so the dog didn't catched the brown fox"></Post>
            </div>
        </div>
        </>
    )
    
}

export default Profile