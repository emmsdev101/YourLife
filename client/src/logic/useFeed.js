import {useState, useEffect} from 'react'
import axios from 'axios'

function useFeed (){
    const my_api = process.env.NODE_ENV === 'development'? 'http://localhost:4000' : ''
    const [feeds, setFeeds] = useState([])

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
            setFeeds(get_feeds.data)
                }
    }
    const addFeed =(newFeed)=> {
        setFeeds(feeds => [newFeed, ...feeds]);
    }
    return {feeds, addFeed}

}
export default useFeed