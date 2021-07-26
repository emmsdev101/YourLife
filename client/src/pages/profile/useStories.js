import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie/es6';
import useFeed from '../../logic/useFeed';
const cookies = new Cookies()
const useStories = () => {
  const params = useParams()
  const username = cookies.get("username")
  const user = params.username
  const isOwn = user === username || user === undefined
    const {getMyStory} = useFeed()  
    const [feedStories, setMyStories] = useState(null);
    const [loading, setLoading] = useState(true);

    let isMounted = useRef(true)

    useEffect(() => {
      isMounted.current = true
      setMyStories(null)
      setLoading(true)
        async function fetchMyStories() {
          const fetched_stories = await getMyStory(isOwn?null:user);
          if (isMounted.current) {
            if (Array.isArray(fetched_stories)) {
              if(isOwn){
                if(feedStories){
                  setMyStories((old_feeds)=>[...old_feeds, ...fetched_stories]);
               }else{
                   setMyStories(fetched_stories)
               }
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
      }, [user]);

      
      const addFeed = (newFeed) => {
        if(Array.isArray(feedStories)){
            setMyStories((feeds) => [newFeed, ...feeds])
        }else{
            setMyStories([].push(newFeed))
        }
      }
      return {
          addFeed,
          feedStories,
          loading
      }
}

export default useStories;
