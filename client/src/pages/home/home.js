import { useState, useEffect } from "react";
import { FaBars, FaBell, FaPlusCircle, FaEnvelope, FaHome, FaUsers } from "react-icons/fa";
import './style.css'
import Post from '../../components/post/post'
import mylove from '../../res/images/mylove.jpg'
import mylove1 from '../../res/images/mylove1.jpg'
import { useHistory } from "react-router-dom";
import CreatePost from '../../components/createPost/createPost'
import axios from "axios";
function Home(){
    const [createPost, setCreatePost] = useState(false);
    const [feeds, setFeeds] = useState([])
    const history = useHistory()

    const server_api = "https://yourlife-emmsdevs.herokuapp.com"
    
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
    const addStory = (story)=>{
        setFeeds(feeds => [story, ...feeds]);
    }
    const fetchFeeds = async() => {
        const get_feeds = await axios({
            method:'get',
            withCredentials: true,
            url:server_api+'/post/all-feeds'
        })
        if(get_feeds.status === 200){
            setFeeds(get_feeds.data)
                }
    }
    useEffect(() => {
        fetchFeeds()
    }, []);
    
    return(
        <>
        {createPost? <CreatePost showMe = {createStory} addStory = {addStory}/>: 
        <>
        <header className="home-header">
            <div className = "active" onClick = {()=>{switchPage('/home')}}> <FaHome className = "nav-icon"></FaHome></div>
            <div className = "inactive" onClick = {()=>{switchPage('/people')}}><FaUsers className = "nav-icon"></FaUsers></div> 
            <div className = "inactive" onClick = {()=>{switchPage('/notification')}}><FaBell className = "nav-icon"></FaBell></div> 
            <div className = "inactive" onClick = {()=>{switchPage('/chat')}}><FaEnvelope className = "nav-icon"></FaEnvelope></div> 
            <div className = "inactive" onClick = {()=>{switchPage('/menu')}}><FaBars className = "nav-icon"></FaBars></div>
        </header> 
      <div className = "home-body">
          <div className = "home-title">
              <div className = "primary-button">
            <button onClick = {createStory}> <FaPlusCircle className = "primary-button-icon"></FaPlusCircle>Share a story</button>
        </div>
              </div>
          <div className = "post-list-div">
              {feeds.map((post, post_id)=>(
                  <Post content = {post}/>
              ))}
          </div>
      </div>
        </>

        
        
        
        }
        
</>
    )
}
export default Home