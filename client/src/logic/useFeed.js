import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
const cookie = new Cookies()

function useFeed() {
  const my_api =
  process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";
  const POST_API = my_api + "/post/create";
  const UPLOAD_API = my_api + "/upload";

  const [feedStories, setFeedStories] = useState(null);
  const [uploadingProgress, setUploadingProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchFeeds = async (page) => {
      try{
        const get_feeds = await axios({
            method: "get",
            withCredentials: true,
            url: my_api + "/post/get-feeds",
            params:{page}
          });
          if (get_feeds.status === 200) {
              if(Array.isArray(get_feeds.data)){
                return get_feeds.data
              }else return null
          }
      }catch(err){
          if(err.response){
            if(err.response.status === 401){
                  cookie.remove("username")
                  window.location.replace("/login")
                return null
            }
          }
        
      }
  };
  const fetchImages = async (feed_item) => {
      try{
        const fetched_images = await axios({
            method: "get",
            withCredentials: true,
            url: my_api + "/photo/post-photos",
            params: { id: feed_item },
          });
          if (fetched_images.status === 200) {
            return fetched_images.data;
          } else {
            console.log(fetched_images.status);
            return null;
          }
        }catch(err){
            if(err.response){
              if(err.response.status === 401){
                  cookie.remove("username")
                  window.location.replace("/login")
                  return null
              }
            }
          
        }
    
  };
  const generateFeeds = async() => {
    try{
      const get_feeds = await axios({
          method: "get",
          withCredentials: true,
          url: my_api + "/post/generate-feeds",
        });
        if (get_feeds.status === 200) {
            if(Array.isArray(get_feeds.data)){
              return get_feeds.data
            }else return null
        }
    }catch(err){
        if(err.response){
          if(err.response.status === 401){
                cookie.remove("username")
                window.location.replace("/login")
              return null
          }
        }
      
    }
  }
  const addFeed = (newFeedPar) => {
    if(feedStories){
      setFeedStories((feeds) => [newFeedPar, ...feeds]);
    }
  };
  const uploadProgress = (progressEvent) => {
    var percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    setUploadingProgress(percentCompleted);
  };

  const uploadDp = async (file) => {
    try {
      const uploadImage = await axios({
        method: "post",
        withCredentials: true,
        url: my_api + "/user/change-profile",
        data: { file: file },
        onUploadProgress: uploadProgress,
      });
      if (uploadImage.status === 200) {
        return uploadImage.data;
      }
    }catch(err){
        if(err.response){
          if(err.response.status === 401){
              cookie.remove("username")
              window.location.replace("/login")
              return null
          }
        }
      
    }
  };
  const postStory = async (content,files) => {
      try{
        const posting = await axios({
            method: "post",
            withCredentials: true,
            url: POST_API,
            data: {
              content: content,
              files: files,
            },
            onUploadProgress: uploadProgress
          });
          if (posting.status === 200) {
              console.log(posting.data)
              return posting.data;
          } else {
            console.log(posting.status);
            return null
          }
        }catch(err){
            if(err.response){
              if(err.response.status === 401){
                  cookie.remove("username")
                  window.location.replace("/login")
                  return null
              }
            }
          
        }
    
  };

  const getAStory = async (post_id) => {
    try {
      const story = await axios({
        method: "get",
        withCredentials: true,
        url: my_api + "/post/view",
        params: { id:post_id },
      });
      if (story.status === 200) {
        setLoading(false);
        return story.data;
      } else {
        console.log(story.status);
      }
    }catch(err){
        if(err.response){
          if(err.response.status === 401){
              cookie.remove("username")
              window.location.replace("/login")
              return null
          }
        }
      
    }
  };
  const getMyStory = async (user) => {
    try {
      const get_feeds = await axios({
        method: "get",
        withCredentials: true,
        url: my_api + "/post/my-posts",
        params: {username:user}
      });
      if (get_feeds.status === 200) {
        return get_feeds.data
      } else {
        console.log(get_feeds.status);
        return null
      }
    } catch(err){
      if(err.response){
        if(err.response.status === 401){
            cookie.remove("username")
            window.location.replace("/login")
            return null
        }
      }
      }
  };
  const requestLike = async (post_data) => {
    try {
      const req_like = await axios({
        method: "post",
        withCredentials: true,
        url: my_api + "/post/like/like-post",
        data: { 
          post_id: post_data._id,
          post_owner:post_data.post_owner,
        },
      });
      if (req_like.status === 200) {
        return true;
      } else {
        console.log(req_like.status);
      }
    }catch(err){
        if(err.response){
          if(err.response.status === 401){
              cookie.remove("username")
              window.location.replace("/login")
              return null
          }
        }
      
    }
  };
  const requestUnlike= async (postId) => {
    try {
      const req_like = await axios({
        method: "post",
        withCredentials: true,
        url: my_api + "/post/like/unlike-post",
        data: { 
          post_id: postId,
        },
      });
      if (req_like.status === 200) {
        return true;
      } else {
        console.log(req_like.status);
      }
    }catch(err){
        if(err.response){
          if(err.response.status === 401){
              cookie.remove("username")
              window.location.replace("/login")
              return null
          }
        }
      
    }
  };
  const postLiked = async (post_id) => {
    try {
      const req_like = await axios({
        method: "get",
        withCredentials: true,
        url: my_api + "/post/like/post-liked",
        params: { post_id: post_id },
      });
      if (req_like.status === 200) {
        return req_like.data;
      } else {
        console.log(req_like.status);
      }
    }catch(err){
        if(err.response){
          if(err.response.status === 401){
              return null
          }
        }
      
    }
  };
  const addComment = async (post_id, content, post_owner) => {
    try {
      const comment = await axios({
        method: "post",
        withCredentials: true,
        url: my_api + "/post/comment/add-comment",
        data: {
             post_id: post_id,
             content:content,
             post_owner:post_owner
             },
      });
      if (comment.status === 200) {
          return comment.data
      }else {
          console.log(comment)
          return false
      }
    }catch(err){
        if(err.response){
          if(err.response.status === 401){
              cookie.remove("username")
              window.location.replace("/login")
              return null
          }
        }
      
    }
  };
  const getComments = async (post_id, page, size) => {
    try {
        const comments = await axios({
          method: "get",
          withCredentials: true,
          url: my_api + "/post/comment/fetch-comments",
          params: { post_id: post_id, page:page, size:size },
        });
        if (comments.status === 200) {
          console.log(comments.data)
          return comments.data;
        } else {
          console.log(comments.status);
        }
    }catch(err){
        if(err.response){
          if(err.response.status === 401){
              cookie.remove("username")
              window.location.replace("/login")
              return null
          }
        }
      
    }
  }
  return {
    feedStories,
    fetchFeeds,
    fetchImages,
    postStory,
    uploadingProgress,
    addFeed,
    uploadDp,
    getMyStory,
    loading,
    getAStory,
    requestLike,
    postLiked,
    addComment,
    getComments,
    requestUnlike,
    generateFeeds
  };
}
export default useFeed;
