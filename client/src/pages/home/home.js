import './homeStyle.css'
import Post from '../../components/post/post'
import CreatePost from '../../components/createPost/createPost'
import { useCustomHooks, useIcons, useReactHooks } from "../../logic/library";
import React from 'react';
function Home(){
    const {useState, useContext, useHistory,useEffect, Cookies} = useReactHooks()
    const {useFeed, GlobalUserActionsContext} = useCustomHooks()
    const { FaPlusCircle} = useIcons()
    
    const username = new Cookies().get('username')
    const [createPost, setCreatePost] = useState(false);
    const {feedStories, addFeed, loading} = useFeed()
    const history = useHistory()
    const set_user_context = useContext(GlobalUserActionsContext)
    useEffect(() => {
        set_user_context(username)
    }, []);
    
    const createStory = ()=>{
        if(createPost){
            setCreatePost(false)
        }else{
            setCreatePost(true)
        }
    }
    const Loader = ()=> {
        return(
            <div className = "loader-div"><div className="loader"></div></div>
        )
    }
    
    return(
        <React.Fragment>
        {createPost? <CreatePost showMe = {createStory} addStory = {addFeed}/>: 
      <div className = "home-body">
          <div className = "home-title">
              <div className = "primary-button">
                <button onClick = {createStory}> <FaPlusCircle className = "primary-button-icon"></FaPlusCircle>Share a story</button>
            </div>
        </div>
        {loading? <Loader/>:''}
          <div className = "post-list-div">
              {!loading && feedStories.length === 0? <><h3>No stories yet </h3><h3>Follow poeple so see their stories</h3></>:''}
             {feedStories.map((story, id)=>(
                 <Post content = {story} key = {id}/>
             ))}
          </div>
      </div>
        }
        </React.Fragment>
    )
}
export default Home