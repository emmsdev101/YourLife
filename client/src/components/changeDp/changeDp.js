
import { useCustomHooks, useIcons, useReactHooks } from '../../logic/library'

function ChangeDp({setUpload, setProfilePhotoUrl,profile_photo_url}){
    const {useState, useContext, useRef} = useReactHooks()
    const {FaUserCircle} = useIcons()
    const {useFeed,usePeople,GlobalUserContext} = useCustomHooks()
    const my_api = process.env.NODE_ENV === 'development'? 'http://localhost:4000' : ''
    const uploadPicker = useRef()
    const {uploadDp, uploadingProgress} = useFeed()
    const {updateDp} = usePeople()
    const [pickedPhoto, setPickedPhoto] = useState(null)
    const user_context = useContext(GlobalUserContext);

    const uploadProfile = () => {
        uploadPicker.current?.click()
    }
    const closeUpload = ()=> {
        setUpload(false)
    }
    const pick = (e) => {
        const picked = e.target.files[0]
        setPickedPhoto(picked)
    }
    const prevImage = (pic) => {
        return URL.createObjectURL(pic)
    }
    const uploadProfilePic = async() => {
        const formData = new FormData()
        formData.append('profile', pickedPhoto)
        const uploadResult = await uploadDp(formData)
        if(uploadResult){
            const updateResult = await updateDp(uploadResult, user_context.username)
            if(updateResult){
                setProfilePhotoUrl(my_api + "/photos/"+uploadResult)
                setUpload(false)
            }
        }
        
    }
    const PickerView = () => {
        return(
            <>
            <input  type = "file" accept = "image/*" hidden ref = {uploadPicker} files = {pickedPhoto} onChange = {pick}/>
            <div className = "upload-menu-body">
            <h3 className = "upload-menu-title">Change Profile Photo</h3>
                {user_context.photo !== undefined || pickedPhoto !== null? <img className = "profilepic-preview" src = {pickedPhoto !== null? prevImage(pickedPhoto):profile_photo_url}></img>:
                <div className = "temp-profilepic-preview"><FaUserCircle className = "temp-avatar-prev"/></div>}
                <div className = "upload-menu-header">
                    {pickedPhoto !== null?
                    <div className = "upload-picked" onClick = {uploadProfilePic}>Save</div>:
                    <>
                    <button className = "upload" onClick = {uploadProfile}>Upload</button>
                    <button className = "upload">Photos</button>
                    </>}
                    <button className = "close-upload-menu" onClick = {closeUpload}>Cancel</button>
                </div>
            </div>
                </>
        )
    }
    const UploadingView = () => {
        return(
            <div className = "uploading-view">
                <h3>Uploading</h3>
                <progress id="uploading-dp" value={uploadingProgress} max="100"> </progress>
                <h3>{uploadingProgress}%</h3>
            </div>
        )
    }
    return(
        <div className = "upload-menu">
            {uploadingProgress > 0? <UploadingView/>:<PickerView/>}
        </div>
    )
}

export default ChangeDp