import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie/es6";
import usePeople from "../../../logic/usePeople";

const cookie = new Cookies()

const useFollowersList = (isOwn, back) => {
    const {getFollowing} = usePeople()
    const [followers, setFollwers] = useState(null)
    const [loading, setLoading] = useState(true)
    const params = useParams()
   const user = params.username


    useEffect(()=> {
        setFollwers(null)
        setLoading(true)
        const getFollowers = async()=> {
            const fetched_followers = await getFollowing(15,1, isOwn?null:user)
            if(Array.isArray(fetched_followers)){
                setFollwers(fetched_followers)
            }
            setLoading(false)
        }
        getFollowers()
    },[user])

    return {followers, loading}
}

export default useFollowersList;
