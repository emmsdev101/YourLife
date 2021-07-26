import { useState } from 'react';

const useProfileMenu = () => {
  const [viewFollowers, setViewFollowers] = useState(false)
  const [viewPost, setViewPost] = useState(null);
  const [createPost, setCreatePost] = useState(false);
  const [openPhotos, setOpenPhotos] = useState(false)

  const seePhotos = () => {
    setOpenPhotos(!openPhotos)
  }

  const toggleOpenFollowers = () => {
    setViewFollowers(!viewFollowers)
  }
  const createStory = () => {
      setCreatePost(!createPost);
    
  };

  return {viewFollowers, toggleOpenFollowers, createStory, createPost, seePhotos, openPhotos,
    viewPost, setViewPost}
}

export default useProfileMenu;
