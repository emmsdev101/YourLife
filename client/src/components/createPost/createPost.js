import { useHistory } from 'react-router-dom'
import React, {useEffect, useState, useContext, createContext} from 'react'
import axios from 'axios';
import './style.css'
import Cookies from 'universal-cookie'
import { FaArrowLeft, FaCamera, FaImages, FaVideo, FaVimeoV } from 'react-icons/fa';
import photo1 from './../../res/images/test1.jpg'
import photo2 from './../../res/images/test2.jpg'
import photo3 from './../../res/images/test3.jpg'
import photo4 from './../../res/images/test4.jpg'
import { GlobalUserActionsContext, GlobalUserContext } from '../../logic/userContext';
import usePeople from './../../logic/usePeople'
import useFeed from '../../logic/useFeed';
function CreatePost({showMe, addStory, postStory, uploadPhoto}){
    const my_api = process.env.NODE_ENV === 'development'? 'http://localhost:4000' : ''
    
    const cookie = new Cookies()
    const owner = cookie.get('username')
    const {getUserInfo} = usePeople()
    
    const [photos, setPhots] = useState([])
    const [content, setContent] = useState('')

    const user_context = useContext(GlobalUserContext);
    const set_user_context = useContext(GlobalUserActionsContext)


    let picker


    useEffect(() => {
        function fetchUser(){
            set_user_context(owner)
        }
        if(owner !== undefined){
            fetchUser()
        }
    }, []);
    const handleInput = (e) =>{
        setContent(e.target.value)
    }

    const handleSubmit = async() => {
        showMe()
        const formData = new FormData()
        photos.forEach(photo => {
            formData.append('image',photo)
        });

        const uploads =  await  uploadPhoto(formData)
        const new_feed = await postStory(user_context,uploads,content)
         addStory(new_feed)
    }
    const openPicker = () =>{
        picker = document.getElementById('image-picker')
        picker.click()
    }
    const pickImage = (e) => {
        const images =  e.target.files
        const list_img = []
        for (var i = 0 ; i < images.length ; i++){
            list_img.push(images[i])
        }
        setPhots(list_img)
    }
    const getUrlImage = (pic) =>{
        const image_url = URL.createObjectURL(pic)
        return image_url
      }
    // const Uploading = ()=>{
    //     return(
    //         <div className = "upload_progress">
    //         <p id = "progress_label">{uploadingProgress < 100 ? "Uploading" :"Done!!!" }</p>
    //             <progress id="uploading" value={uploadingProgress} max="100"> </progress>
    //      </div>
    //     )
    // }

    return(
        <>
        {/* {uploadingProgress > 0 && uploadingProgress < 100? <Uploading/>:''} */}
        <div className = "createPost">
            <div className = "createPost-header">
                <button className = 'back-btn' onClick = {showMe}> <FaArrowLeft className = 'back-icon'/></button>
                <h4 className = 'header-title'>Create a story</h4>
                <button className = 'post-btn' onClick = {handleSubmit}>Post</button>
            </div>
            <hr/>
            <div className = "createPost-body">
                <div className = 'post-content-div'>
                    <textarea id = 'post-input' className = 'post-input' rows = "10" placeholder = 'Whats new?'
                        value = {content} onChange = {handleInput}></textarea>
                    <div className = 'photo-list'>
                        
                    {photos.length > 0? photos.map((pic, picid)=>(
                        <img id = {picid} src = {getUrlImage(pic)}  className = 'photos'></img>
                    )):''}
                    </div>
                    <input type = "file" accept = "image/*" className = "hide" id = "image-picker" onChange = {pickImage} multiple/>
                </div>
                <div className = "add-photos" onClick = {openPicker}>
                    <FaImages className = 'photos-videos-icon'/>
                    <p>Photo</p>
                </div>
                <div className = "add-photos">
                    <FaCamera className = 'photos-videos-icon'/>
                    <p>Capture</p>
                </div>
                <div className = "add-photos">
                    <FaVideo className = 'photos-videos-icon'/>
                    <p>Vedio</p>
                </div>
                <div className = "add-photos">
                    
                </div>
            </div>
        </div>
    </>)

}
export default CreatePost