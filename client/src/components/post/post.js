import './style.css'
import { useCustomHooks, useIcons, useReactHooks } from '../../logic/library'

function Post({content, id}){
    const {useState, useRef,useEffect} = useReactHooks()
    const {useFeed, usePeople} = useCustomHooks()
    const {FaComment, FaEllipsisH, FaThumbsUp, FaUserCircle } = useIcons()
    const my_api = process.env.NODE_ENV === 'development'? 'http://localhost:4000' : ''
    const {fetchImages} = useFeed()
    const {getUserInfo} = usePeople()
    const [photos, setPhotos] = useState([])
    const [render, setRender] = useState(false)
    const [userDetails, setUserDetails] = useState({})
    const isMounted = useRef(true)
    const profile_photo_url = my_api + "/photos/"+userDetails.photo
    
    useEffect(() => {
        const getUserDetails = async()=>{
            const fetchResult = await getUserInfo(content.owner)
            if(isMounted.current)setUserDetails(fetchResult)
        }
        getUserDetails()
        setPhotos([])
        const images = fetchImages(content._id)
        images.then((items)=>{
            if(isMounted.current){
                if(items.length > 0)setPhotos(items)
                else setRender(true)
            }
        }, (reasion)=>{
            console.log(reasion)
        return()=>{
            isMounted.current = false
        }
        })
    }, [content]);
    useEffect(()=>{
        if(photos.length>0){
            photos.forEach(photo => {
                let image = new Image()
                image.src = photo.path
            });
            setRender(true)
        }
    }, [photos])
    if(render){
        return(
            <div className = "post-div" id = {id}>
                <div className = "post-heading">
                    {userDetails.photo !== undefined? <img className = "profile-photo" src = {profile_photo_url} alt = "profile picture"/>
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
                            {photos !== undefined? photos.map((photo, id)=>{
                                if(id < 4){
                                    const src =  my_api+"/photos/"+photo.path
                                    if(photos.length === 1){
                                        return (<img src = {src} id = {id} className = 'single content-photo'></img>)
                                    }else if(photos.length === 2){
                                        return (<img src = {src} id = {id} className = 'double content-photo'></img>)
                                    }else if(photos.length === 3){
                                        if(id < 2 ){
                                            return (<img src = {src} id = {id} className = 'tripple content-photo'></img>)
                                        }else{
                                            return (<img src = {src} id = {id} className = 'tripple-row content-photo'></img>)
                                        } 
                                    }else if(photos.length > 3){
                                        return (<img src = {src} id = {id} className = 'quad content-photo'></img>) 
                                    }
                                }
                            }):''}
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