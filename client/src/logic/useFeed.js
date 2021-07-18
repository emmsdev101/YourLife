import {useState, useEffect} from 'react'
import axios from 'axios'

function useFeed (){
    const my_api = process.env.NODE_ENV === 'development'? 'http://localhost:4000' : ''
    const POST_API = my_api + '/post/create'
    const UPLOAD_API = my_api + '/upload'
    
    const [feedStories, setFeedStories] = useState([])
    const [uploadingProgress, setUploadingProgress] = useState(0)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeeds()
    }, []);
    const fetchFeeds = async()=> {
        const get_feeds = await axios({
            method:'get',
            withCredentials: true,
            url: my_api+'/post/all-feeds'
        })
        if(get_feeds.status === 200){
            setFeedStories(get_feeds.data)
            setLoading(false)
            }
    }
    const fetchImages = async(feed_item)=>{
        const fetched_images = await axios({
            method:'get',
            withCredentials: true,
            url: my_api+'/upload/post/',
            params : {id: feed_item}
        })
        if(fetched_images.status === 200){
            return fetched_images.data
        }else{
            console.log(fetched_images.status)
            return null
        }
}
    const addFeed =(newFeedPar)=> {
        setFeedStories(feeds => [newFeedPar, ...feeds]);
    }
    const uploadProgress = (progressEvent)=> {
        var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
        setUploadingProgress(percentCompleted)
}
    const uploadPhoto = async(formData) => {
        try {
            const upload = await axios({
                method:'post',
                withCredentials:true,
                headers:{"Content-Type" : "multipart/form-data"},
                url:UPLOAD_API,
                data:formData,
                onUploadProgress: uploadProgress
            })
            if(upload.status === 200){
                return upload.data
            }
            return false
        } catch (errors) {
            console.log(errors)
        }
    }
    const uploadDp = async (file) => {
        try {
            const uploadImage = await axios({
                method:'post',
                withCredentials:true,
                url:my_api + "/upload/change-profile",
                data:{file:file},
                onUploadProgress: uploadProgress
            })
            if(uploadImage.status === 200){
                return uploadImage.data
            }
        } catch (error) {
            return false
        }
    }
    const postStory = async(user_context,paths, content) => {
        const fullname = user_context.firstname + ' ' + user_context.lastname 
        const posting = await axios({
            method : 'post',
            withCredentials: true,
            url : POST_API,
            data:{
                owner:user_context.username,
                fullname:fullname,
                content:content,
                imagePath:paths
            },
        })
        if(posting.status === 200){
            return posting.data
        }else{
            console.log(posting.status)
        }
    }
    const uploadDataUrl = async(files) => {
        try {
            const uploadImage = await axios({
                method:'post',
                withCredentials:true,
                url:my_api + "/upload/upload",
                data:{files:files},
                onUploadProgress: uploadProgress
            })
            if(uploadImage.status === 200){
                return uploadImage.data
            }
        } catch (error) {
            console.log(error)
            return false
        }
    }
    const getMyStory = async() => {
        try{
            const get_feeds = await axios({
                method:'get',
                withCredentials: true,
                url: my_api+'/post/my-posts'
            })
            if(get_feeds.status === 200){
                return get_feeds.data
            }else{
                console.log(get_feeds.status)
            }
        }catch(err){
            console.log(err)
        }
    }
    
    return {feedStories, fetchImages, postStory,uploadPhoto, uploadingProgress, addFeed, uploadDp, uploadDataUrl,getMyStory,loading}

}
export default useFeed