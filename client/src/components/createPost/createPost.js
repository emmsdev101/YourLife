import { useCustomHooks, useIcons, useReactHooks } from "../../logic/library"
import './style.css'
function CreatePost({showMe, addStory, postStory, uploadPhoto}){
    const {useState, useContext,useEffect, Cookies} = useReactHooks()
    const {GlobalUserContext, GlobalUserActionsContext} = useCustomHooks()
    const{FaCamera,FaArrowLeft, FaImages,FaVideo} = useIcons()
    const cookie = new Cookies()
    const owner = cookie.get('username')

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
        if(photos.length > 0){
            const formData = new FormData()
            photos.forEach(photo => {
                formData.append('image',photo)
            });

            const uploads =  await  uploadPhoto(formData)
            const new_feed = await postStory(user_context,uploads,content)
            addStory(new_feed)
        }else{
            const new_feed = await postStory(user_context,[],content)
            addStory(new_feed)
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
    return(
        <>
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