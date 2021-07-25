import { useEffect, useState } from "react";
import usePeople from "../../../logic/usePeople";

const useFollowersList = (isOwn, back) => {
    const {getFollowing} = usePeople()
    const [followers, setFollwers] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=> {
        const getFollowers = async()=> {
            const fetched_followers = await getFollowing(15,1)
            if(Array.isArray(fetched_followers)){
                setFollwers(fetched_followers)
            }
            setLoading(false)
        }
        getFollowers()
    },[])

    return {followers, loading}
}

export default useFollowersList;
