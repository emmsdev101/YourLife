import './style.css'
import { useCustomHooks, useIcons, useReactHooks } from '../../logic/library'
import PostImage from '../postImage/postImage'

function Post({content, id}){
    const {useState, useRef,useEffect} = useReactHooks()
    const {useFeed, usePeople} = useCustomHooks()
    const {FaComment, FaEllipsisH, FaThumbsUp, FaUserCircle } = useIcons()
    const my_api = process.env.NODE_ENV === 'development'? 'http://localhost:4000' : ''
    const {fetchImages} = useFeed()
    const {getUserInfo} = usePeople()
    const [photos, setPhotos] = useState([])
    const [render, setRender] = useState(false)
    const [userDetails, setUserDetails] = useState(null)
    const isMounted = useRef(true)
    const profile_photo_url = userDetails !== null?my_api + "/photos/"+userDetails.photo:''

    useEffect(() => {
        const getUserDetails = async()=>{
            const fetchResult = await getUserInfo(content.owner)
            if(isMounted.current){
                setUserDetails(fetchResult)
                let pp = new Image()
                pp.onload = ()=> {
                    setRender(true)
                }
                pp.src = my_api + "/photos/"+fetchResult.photo
            }
        }
        getUserDetails()
        setPhotos([])
        const images =  fetchImages(content._id)
        images.then((items)=>{
            if(isMounted.current){
                setPhotos(items)

            }
        }, (reasion)=>{
            console.log(reasion)
        return()=>{
            isMounted.current = false
        }
        })
    }, [content]);
    useEffect(() => {
        for (var i = 0; i < photos.length; i++) {
            var tempImage = new Image();
            tempImage.addEventListener("load", trackProgress, true);
            tempImage.src = photos[i].path;
        }
    }, [photos]);
    function trackProgress(){
        console.log("Image loaded")
    }
    if(userDetails !== null){
        return(
            <div className = "post-div" id = {id}>
                <div className = "post-heading">
                    {render?<img className = "profile-photo" src = {profile_photo_url} alt = "profile picture"/>
                    : <FaUserCircle className = "alt-dp"/>}
                    <div className = "post-details">
                        <h4>{userDetails.firstname + ' ' + userDetails.lastname}</h4>
                        <p>13 minutes ago</p>
                    </div>
                    <div className = "post-menu"> <FaEllipsisH className = "post-menu-icon"></FaEllipsisH> </div>
                </div>
                <div className = "post-body">
                    <div className = "content-text">
                        <p className = "content">
                            {content.content}
                        </p>
                        <div className = 'images-section'>
                            {photos !== undefined? photos.map((photo, id)=>(
                                <PostImage photosQuant = {photos.length} photo = {photo} id = {id} src = {my_api+"/photos/"+photo.path}/>
                            )
                            ):''}
                            {photos !== undefined && photos.length > 4 ? <button className = 'more-btn'>{photos.length - 4} more</button>:''}
                        </div>
                        
                        <div className = "content-footer">
                        <div className = "comment-status"><p className = "comment-count">{content.likes}</p><p className = "status-title">Likes</p></div>
                            <div className = "comment-status"><p className = "comment-count">{content.comments}</p><p className = "status-title">Comments</p></div>
                        </div>
                        <hr></hr>
                    </div>
                </div>
                <div className = "post-footer">
                    <button className = "like-button"><FaThumbsUp className = "like-icon"></FaThumbsUp>Like</button>
                    <button className = "like-button"><FaComment className = "like-icon"></FaComment>Comment</button>
                </div>
            </div>
        )
    }else return(<></>)
}
export default Post