import './homeStyle.css'
import Post from '../../components/post/post'
import CreatePost from '../../components/createPost/createPost'
import { useCustomHooks, useIcons, useReactHooks } from "../../logic/library";
function Home(){
    const {useState, useContext, useHistory,useEffect, Cookies} = useReactHooks()
    const {useFeed, GlobalUserActionsContext} = useCustomHooks()
    const {FaBars, FaBell, FaPlusCircle, FaEnvelope, FaHome, FaUsers} = useIcons()
    
    const username = new Cookies().get('username')
    const [createPost, setCreatePost] = useState(false);
    const {uploadDataUrl,postStory, uploadingProgress, feedStories, addFeed} = useFeed()
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
        {createPost? <CreatePost showMe = {createStory} addStory = {addFeed} postStory = {postStory} uploadPhoto = {uploadDataUrl}/>: 
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
        }
        
</>
    )
}
export default Home