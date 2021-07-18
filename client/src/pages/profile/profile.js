
import './profile.css'
import ChangeDp from './../../components/changeDp/changeDp'
import Post from '../../components/post/post'
import { useCustomHooks, useIcons, useReactHooks } from '../../logic/library'
import  FriendItem  from "./friend";
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

    const [photos, setPhotos] = useState([]);
    const [upload, setUpload] = useState(false)
    const {fetchPhotos, getFollowing, getFollowStatus} = usePeople()
    const {getMyStory} = useFeed()
    
    const fullname = user_context.firstname + ' ' +user_context.lastname
    const [profile_photo_url, setProfilePhotoUrl] = useState()
    const [follows, setFollows] = useState([])
    const [followStatus, setFollowStatus] = useState({})
    const [myStories, setMyStories] = useState([])

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
        async function fetchProfileData() {
            setFollows(await getFollowing())
            setFollowStatus(await getFollowStatus())
            setMyStories(await getMyStory())
        }
        setupPhotos()
        fetchProfileData()
    }, []);
    useEffect(() => {
        let pp = new Image()
        pp.onload =()=>{
            setProfilePhotoUrl(my_api + "/photos/"+user_context.photo)
        }
        pp.src = my_api + "/photos/"+user_context.photo
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
      <div className = "profile-header-div">
          <div className = "row1-profile-header">
              <div className = "follower-div">
                  <p className = "follow-count">{followStatus.followers}</p>
                  <p className = "follow-count-title">Followers</p>
              </div>
              {profile_photo_url !== undefined? <Avatar/>:<TempAvatar/>}
              <div className = "following-div">
                  <p className = "follow-count">{followStatus.following}</p>
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
            <h4>Following</h4>
            <div className = "friends-list-div">
                {follows.map((user, id)=>(
                    <FriendItem username = {user.following} id = {id}/>
                ))}
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
            {myStories.length > 0? myStories.map((story, id) => (
                <>
                <Post content = {story} id = {id}/>
                <div className = "span"></div>
                </>
            )):''}
            </div>
        </div>
        </>
    )
    
}

export default Profile