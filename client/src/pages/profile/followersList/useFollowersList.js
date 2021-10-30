import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie/es6";
import usePeople from "../../../logic/usePeople";

const cookie = new Cookies()

const useFollowersList = (isOwn, back) => {
    const {getFollowing, searchFollower} = usePeople()
    const [followers, setFollwers] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadingNext, setLoadingNext] = useState(false)
    const [page, setPage] = useState(1)
    const [toSearch, setToSearch] =  useState('')
    const [isSearching, setIsSearching] = useState(false)
    const params = useParams()
    const user = params.username


    useEffect(()=> {
        setFollwers([])
        setLoading(true)
        getFollowers()
    },[user])
    useEffect(()=>{
        if(toSearch.length > 2){
            search()
            setIsSearching(true)
        }else if(toSearch.length <= 0){
            getFollowers()
            setIsSearching(false)
        }
    },[toSearch])
    async function getFollowers(){
        setLoading(true)
        setFollwers([])
        const fetched_followers = await getFollowing(20,0, isOwn?null:user)
        if(Array.isArray(fetched_followers)){
            setFollwers(fetched_followers)
        }
        setLoading(false)
    }
    const nextPage = async() => {
        setLoading(true)
        const fetched_followers = await getFollowing(20,page, isOwn?null:user)
        if(fetched_followers){
            setFollwers((olds)=>[...olds, ...fetched_followers])
            setLoading(false)
        }
        setPage(page+1)
    }
    const searchInput = (e) => {
        setToSearch(e.target.value)
    }
    const search = async() =>{
        setLoading(true)
        setFollwers([])
        const searchResult = await searchFollower(toSearch)
        if(searchResult){
            setFollwers(searchResult)
            setLoading(false)
        }else{

        }
    }

    return {followers, loading, searchInput, toSearch, nextPage, loadingNext, isSearching}
}

export default useFollowersList;
