
import { useCustomHooks, useIcons, useReactHooks } from '../../logic/library'

function ChangeDp({setUpload, setProfilePhotoUrl,profile_photo_url}){
    const {useState, useContext, useRef, useEffect} = useReactHooks()
    const {FaUserCircle} = useIcons()
    const {useFeed,usePeople,GlobalUserContext,GlobalUserActionsContext} = useCustomHooks()
    const my_api = process.env.NODE_ENV === 'development'? 'http://localhost:4000' : ''
    let uploadPicker = useRef(null)
    const {uploadDp, uploadingProgress} = useFeed()
    const {updateDp} = usePeople()
    const [pickedPhoto, setPickedPhoto] = useState(null)
    const user_context = useContext(GlobalUserContext);
    const set_user_context = useContext(GlobalUserActionsContext)

    const uploadProfile = () => {
        // let upload_picker
        // upload_picker = document.getElementById("image-picker")
        // upload_picker.click()
        uploadPicker.current?.click()
    }
    const closeUpload = ()=> {
        setUpload(false)
    }
    const pick = (e) => {
        const picked = e.target.files
        setPickedPhoto(picked)
    }
    const prevImage = (pic) => {
        return URL.createObjectURL(pic[0])
    }
    const uploadProfilePic = async() => {
        console.log("uploading")
        const formData = new FormData()
        formData.append('profile', pickedPhoto[0])
        const uploadResult = await uploadDp(formData)
        if(uploadResult){
            console.log("uploaded")
            const updateResult = await updateDp(uploadResult, user_context.username)
            if(updateResult){
                set_user_context(user_context.username)
               // setProfilePhotoUrl(my_api + "/photos/"+uploadResult)
                setUpload(false)
                console.log("updated")
            }else{
                console.log("there is error while updating profile")
            }
        }else{
            console.log("Error while uploading photo")
        }
        
    }
    const PickerView = () => {
        return(
            <>
            <div className = "upload-menu-body">
            <h3 className = "upload-menu-title">Change Profile Photo</h3>
                {pickedPhoto !== null || user_context.photo !== undefined? <img className = "profilepic-preview" src = {pickedPhoto !== null?prevImage(pickedPhoto):profile_photo_url}/>:
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
            <input  type = "file" accept = "image/*" ref = {uploadPicker}  id = "image-picker" files = {pickedPhoto} onChange = {pick}  hidden/>
            {uploadingProgress > 0? <UploadingView/>:<PickerView/>}
        </div>
    )
}

export default ChangeDp