import React, { useEffect, useRef, useState } from 'react';
import useFeed from '../../logic/useFeed';

const useStories = () => {
    const {getMyStory} = useFeed()  

    const [feedStories, setMyStories] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewPost, setViewPost] = useState(null);
    const [createPost, setCreatePost] = useState(false);

    let isMounted = useRef(true)

    useEffect(() => {
        async function fetchMyStories() {
          const fetched_stories = await getMyStory();
          if (isMounted.current) {
            if (Array.isArray(fetched_stories)) {
              if(feedStories){
                 setMyStories((old_feeds)=>[...old_feeds, ...fetched_stories]);
              }else{
                  setMyStories(fetched_stories)
              }
              setLoading(false);
            }
          }
        }
        fetchMyStories();
        return () => {
          isMounted.current = false;
        };
      }, []);
      const createStory = () => {
        if (createPost) {
          setCreatePost(false);
        } else {
          setCreatePost(true);
        }
      };
      
      const addFeed = (newFeed) => {
        if(Array.isArray(feedStories)){
            setMyStories((feeds) => [newFeed, ...feeds])
        }else{
            setMyStories([].push(newFeed))
        }
      }
      return {
          createPost,
          createStory,
          addFeed,
          viewPost,
          setViewPost,
          feedStories,
          loading
      }
}

export default useStories;
