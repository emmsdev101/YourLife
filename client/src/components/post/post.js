import './style.css'
import {useEffect, useState} from 'react'
import image1 from '../../res/images/test2.jpg'
import { FaComment, FaEllipsisH, FaThumbsUp } from 'react-icons/fa'
import axios from 'axios'

function Post({content}){
    const [photos, setPhotos] = useState([]);
    const server_api = "https://yourlife-emmsdevs.herokuapp.com"
    const fetchImages = async() => {
        const fetched_images = await axios({
            method:'get',
            withCredentials: true,
            url: server_api+'/upload/post/',
            params : {id: content._id}
        }
        )
        if(fetched_images.status === 200){
            setPhotos(fetched_images.data)
            console.log(fetched_images.data)
        }else{
            console.log(fetched_images.status)
        }
    }
    useEffect(() => {
        fetchImages()   
    }, []);
    return(
        <>
        <div className = "post-div" id = {content._id}>
            <div className = "post-heading">
                <img className = "profile-photo" src = {image1}>
                </img>
                <div className = "post-details">
                    <h4>Emmanuel Katipunan</h4>
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
                        {photos.map((photo, id)=>{
                            if(id < 4){
                                const src = "https://your-life-amazing.herokuapp.com/photos/"+photo.path
                                if(photos.length > 4) console.log(photo.path) 
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
                        })}
                        {photos.length > 4 ? <button className = 'more-btn'>{photos.length - 4} more</button>:''}
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
        </>
    )
}
export default Post