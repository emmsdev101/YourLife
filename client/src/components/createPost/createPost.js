import { useHistory } from 'react-router-dom'
import { useState, useEffect } from "react";
import axios from 'axios';
import './style.css'
import Cookies from 'universal-cookie'
import { FaArrowLeft, FaCamera, FaImages, FaVideo, FaVimeoV } from 'react-icons/fa';
import photo1 from './../../res/images/test1.jpg'
import photo2 from './../../res/images/test2.jpg'
import photo3 from './../../res/images/test3.jpg'
import photo4 from './../../res/images/test4.jpg'
function CreatePost({showMe, addStory}){
    const my_api = process.env.NODE_ENV === 'development'? 'http://localhost:4000' : ''
    const POST_API = my_api + '/post/create'
    const UPLOAD_API = my_api + '/upload'
    const cookie = new Cookies()
    const owner = cookie.get('username')
    
    const [photos, setPhots] = useState([])
    const [content, setContent] = useState('')

    let picker
    useEffect(() => {
    }, []);
    const handleInput = (e) =>{
        setContent(e.target.value)
    }
    const handleSubmit = async() => {
        const paths = await uploadHandler()
        console.log(paths)
        postStory(paths)
        
    }
    const postStory = async(paths) => {
        const posting = await axios({
            method : 'post',
            withCredentials: true,
            url : POST_API,
            data:{
                owner:owner,
                content:content,
                imagePath:paths
            }
        })
        alert('posting')
        if(posting.status === 200){
            alert('Posted')
            addStory(posting.data)
            showMe()
        }else{
            console.log(posting.status)
        }
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
    const uploadHandler = async() => {
        const form_data = new FormData()
        const images = document.getElementById('image-picker').files
        photos.forEach(photo => {
            form_data.append('image',photo)
        });
       
        try {
            const upload = await axios({
                method:'post',
                withCredentials:true,
                headers:{"Content-Type" : "multipart/form-data"},
                data:form_data,
                url:UPLOAD_API
            })
            if(upload.status === 200){
                return upload.data
            }
            return false
        } catch (errors) {
            console.log(errors)
        }
    }

    return(
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
    )

}
export default CreatePost