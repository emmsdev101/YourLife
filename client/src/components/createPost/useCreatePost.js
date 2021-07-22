import { useContext } from "react"
import { useState, useEffect } from "react"
import Cookies from "universal-cookie"
import imageCompression from "../../logic/imageCompression"
import useFeed from "../../logic/useFeed"
import { GlobalUserActionsContext, GlobalUserContext } from "../../logic/userContext"

const useCreatePost = (showMe, addStory) => {
    const {postStory, uploadingProgress} = useFeed() 
    const {getUrlImage} = imageCompression()
    const cookie = new Cookies()
    const owner = cookie.get('username')
    const [content, setContent] = useState('')
    const [imgFiles, setImgFiles] = useState([])

    const set_user_context = useContext(GlobalUserActionsContext)

    const [posting, setPosting] = useState(false)

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
                setPosting(true)
                const newPost = await postStory( content, imgFiles) 
                if(newPost){
                    addStory(newPost)
                }else{
                    alert("Error uploading your photo")
                }
                setPosting(false)
                showMe()
            }
            else{
                if(content !== ""){
                    setPosting(true)
                    const newPost = await postStory(content, null) 
                    if(newPost){
                        addStory(newPost)
                    }else{
                        alert("Error uploading your photo")
                    }
                    setPosting(false)
                    showMe()
                }else{
                    alert("Please dont post empty")
                }
            }
        }catch(err){
            setPosting(false)
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
    return {
        uploadingProgress,
        posting,
        handleInput,
        handleSubmit,
        content,
        imgFiles,
        pickImage,
        openPicker
    }
}
export default useCreatePost