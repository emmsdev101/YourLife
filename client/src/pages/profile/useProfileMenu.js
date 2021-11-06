import { useState } from 'react';

const useProfileMenu = () => {
  const [viewFollowers, setViewFollowers] = useState(null)
  const [viewPost, setViewPost] = useState(null);
  const [createPost, setCreatePost] = useState(false);
  const [openPhotos, setOpenPhotos] = useState(false)

  const seePhotos = () => {
    setOpenPhotos(!openPhotos)
  }

  const toggleOpenFollowers = () => {
    if(!viewFollowers){
      setViewFollowers("followers")
    }else{
      setViewFollowers(null)
    }
  }
  const toggleOpenFollowing = () => {
    if(!viewFollowers){
      setViewFollowers("following")
    }else{
      setViewFollowers(null)
    }
  }
  const createStory = () => {
      setCreatePost(!createPost);
    
  };

  return {viewFollowers, toggleOpenFollowers,toggleOpenFollowing, createStory, createPost, seePhotos, openPhotos,
    viewPost, setViewPost}
}

export default useProfileMenu;
