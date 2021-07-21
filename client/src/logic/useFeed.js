import { useState, useEffect } from "react";
import axios from "axios";

function useFeed() {
  const my_api =
    process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";
  const POST_API = my_api + "/post/create";
  const UPLOAD_API = my_api + "/upload";

  const [feedStories, setFeedStories] = useState(null);
  const [uploadingProgress, setUploadingProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchFeeds = async () => {
    const get_feeds = await axios({
      method: "get",
      withCredentials: true,
      url: my_api + "/post/all-feeds",
    });
    if (get_feeds.status === 200) {
        console.log(get_feeds.data)
        setFeedStories(get_feeds.data);
        setLoading(false);
    }
  };
  const fetchImages = async (feed_item) => {
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
  };
  const addFeed = (newFeedPar) => {
    setFeedStories((feeds) => [newFeedPar, ...feeds]);
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
    } catch (error) {
      return false;
    }
  };
  const postStory = async (content,files) => {
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
    }
  };

  const getAStory = async (post_id) => {
    try {
      const story = await axios({
        method: "get",
        withCredentials: true,
        url: my_api + "/post/view",
        params: { post_id },
      });
      if (story.status === 200) {
        return story.data;
        setLoading(false);
      } else {
        console.log(story.status);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getMyStory = async () => {
    setLoading(true);
    try {
      const get_feeds = await axios({
        method: "get",
        withCredentials: true,
        url: my_api + "/post/my-posts",
      });
      if (get_feeds.status === 200) {
        setFeedStories(get_feeds.data);
        setLoading(false);
      } else {
        console.log(get_feeds.status);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const requestLike = async (post_id) => {
    try {
      const req_like = await axios({
        method: "post",
        withCredentials: true,
        url: my_api + "/post/like/like-post",
        data: { post_id: post_id },
      });
      if (req_like.status === 200) {
        return true;
      } else {
        console.log(req_like.status);
      }
    } catch (err) {
      console.log(err);
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
    } catch (err) {
      console.log(err);
    }
  };
  const addComment = async (post_id, content) => {
    try {
      const comment = await axios({
        method: "post",
        withCredentials: true,
        url: my_api + "/post/comment/add-comment",
        data: {
             post_id: post_id,
             content:content
             },
      });
      if (comment.status === 200) {
          return comment.data
      }else {
          console.log(comment)
          return false
      }
    } catch (err) {
        console.log(err);
        return false
      
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
      } catch (err) {
        console.log(err);
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
  };
}
export default useFeed;
