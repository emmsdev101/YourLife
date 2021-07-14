import { useState, useEffect, useContext } from "react";
import { FaBars, FaBell, FaPlusCircle, FaEnvelope, FaHome, FaUsers } from "react-icons/fa";
import './style.css'
import Post from '../../components/post/post'
import mylove from '../../res/images/mylove.jpg'
import mylove1 from '../../res/images/mylove1.jpg'
import { useHistory } from "react-router-dom";
import CreatePost from '../../components/createPost/createPost'
import axios from "axios";
import useFeed from "../../logic/useFeed";
import Cookies from "universal-cookie";
import { GlobalUserActionsContext, GlobalUserContext } from "../../logic/userContext";
function Home(){
    const username = new Cookies().get('username')
    const [createPost, setCreatePost] = useState(false);
    const [uploading, setUploading] = useState(false)
    const {postStory,uploadPhoto, uploadingProgress, feedStories, addFeed} = useFeed()
    const history = useHistory()
    const user_context = useContext(GlobalUserContext);
    const set_user_context = useContext(GlobalUserActionsContext)

    useEffect(() => {
        
        set_user_context(username)
    }, []);
    
    function switchPage(page){
        history.push(page)
    }
    const createStory = ()=>{
        if(createPost){
            setCreatePost(false)
        }else{
            setCreatePost(true)
        }
        
    }
    const Loader = ()=> {
        return(
            <div className = "loader-div"><div class="loader"></div></div>
        )
    }
    const Uploading = ()=>{
        return(
            <div className = "upload_progress">
            <p id = "progress_label">{uploadingProgress < 100 ? "Uploading" :"Done!!!" }</p>
                <progress id="uploading" value={uploadingProgress} max="100"> </progress>
         </div>
        )
    }
    return(
        <>
        {createPost? <CreatePost showMe = {createStory} addStory = {addFeed} postStory = {postStory} uploadPhoto = {uploadPhoto}/>: 
        <>
        <header className="home-header">
            <div className = "active" onClick = {()=>{switchPage('/home')}}> <FaHome className = "nav-icon"></FaHome></div>
            <div className = "inactive" onClick = {()=>{switchPage('/people')}}><FaUsers className = "nav-icon"></FaUsers></div> 
            <div className = "inactive" onClick = {()=>{switchPage('/notification')}}><FaBell className = "nav-icon"></FaBell></div> 
            <div className = "inactive" onClick = {()=>{switchPage('/chat')}}><FaEnvelope className = "nav-icon"></FaEnvelope></div> 
            <div className = "inactive" onClick = {()=>{switchPage('/menu')}}><FaBars className = "nav-icon"></FaBars></div>
        </header> 
      <div className = "home-body">
          {uploadingProgress > 0 && uploadingProgress < 100? <Uploading/>:''}
          <div className = "home-title">
              <div className = "primary-button">
                <button onClick = {createStory}> <FaPlusCircle className = "primary-button-icon"></FaPlusCircle>Share a story</button>
            </div>
        </div>
        {feedStories.length < 1? <Loader/>:''}
          <div className = "post-list-div">
             {feedStories.map((story, id)=>(
                 <>
                 <Post content = {story} id = {id}/>
                 <div className = "span"></div>
                 </>
             ))}
          </div>
      </div>
        </>
        }
        
</>
    )
}
export default Home