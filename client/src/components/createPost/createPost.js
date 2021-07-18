import { useRef } from "react"
import { useCustomHooks, useIcons, useReactHooks } from "../../logic/library"
import imageCompression from './../../logic/imageCompression'
import './style.css'
function CreatePost({showMe, addStory}){
    const {useState, useContext,useEffect, Cookies} = useReactHooks()
    const {GlobalUserContext, GlobalUserActionsContext,useFeed} = useCustomHooks()

    const {uploadDataUrl,postStory, uploadingProgress} = useFeed() 
    const{FaCamera,FaArrowLeft, FaImages,FaVideo} = useIcons()
    const {getUrlImage} = imageCompression()
    const cookie = new Cookies()
    const owner = cookie.get('username')
    const [content, setContent] = useState('')
    const [imgFiles, setImgFiles] = useState([])

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
        try{
            if(imgFiles.length > 0){
                const uploads =  await uploadDataUrl(imgFiles)
                const newPost = await postStory(user_context, uploads, content) 
                addStory(newPost)
                showMe()
            }
            else{
                if(content !== ""){
                    const newPost = await postStory(user_context, null, content) 
                    addStory(newPost)
                    showMe()
                }else{
                    alert("Please dont post empty")
                }
            }
        }catch(err){
            console.log(err)
        }
    }
    const openPicker = () =>{
        picker = document.getElementById('image-picker')
        picker.click()
    }
    const pickImage = async(e) => {
        const files =  e.target.files
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            await getUrlImage(file, addImage)
        }
        function addImage(data){
            setImgFiles(imgFiles => [...imgFiles, data])
        }
    }
    const UploadingView = () => {
        return(
            <div className = "upload-menu">
                <div className = "uploading-view">
                <h3>Uploading</h3>
                <progress id="uploading-dp" value={uploadingProgress} max="100"> </progress>
                <h3>{uploadingProgress}%</h3>
            </div>
            </div>
        )
    }
    return(
        <>
        <div className = "createPost">
        {uploadingProgress > 0 && uploadingProgress < 100? <UploadingView/>:''}
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
                    {imgFiles.length > 0? imgFiles.map((url, id)=>(
                        <img alt = "pictures" key = {id} src = {url} className = "photos"/>
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