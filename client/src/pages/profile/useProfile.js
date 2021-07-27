import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import useFeed from "../../logic/useFeed";
import usePeople from "../../logic/usePeople";
import { useParams } from "react-router-dom";
import {
  GlobalUserActionsContext,
  GlobalUserContext,
} from "../../logic/userContext";
import Cookies from "universal-cookie";

const cookie = new Cookies();
const useProfile = () => {
  const params = useParams()
  const user = params.username
  ///console.log(user)
  const owner = cookie.get("username");
  const my_api =
    process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";
  let isOwn = user === owner || user === undefined?true:false;
  const history = useHistory();
  const user_context = useContext(GlobalUserContext);
  const set_user_context = useContext(GlobalUserActionsContext);

  const { fetchPhotos, getFollowing, getUserInfo, follow } = usePeople();

  const [photos, setPhotos] = useState(null);
  const [follows, setFollows] = useState(null);
  const [fullname, setFullname]  = useState(null)
  const [gender, setGender] = useState(null) 
  const [followers, setFollowers] = useState(null)
  const [following, setFollowing] = useState(null)
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [isFollowed, setIsFollwed] = useState(false)

  let isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    setPhotos(null)
    setFollows(null)
    setFullname(null)
    setGender(null)
    setFollowers(null)
    setProfilePhoto(null)

    if(user_context.username === undefined){
      set_user_context()
    }
    async function fetchProfileData() {
      const profileData = await getUserInfo(isOwn?null:user)
      const following = await getFollowing(6,1,isOwn?null:user);
      const fetchResult = await fetchPhotos(user);
      if (isMounted.current) {
        setPhotos(fetchResult);
        setFollows(following);
        setFullname(profileData.firstname + " " + profileData.lastname)
        setGender(profileData.gender)
        setFollowers(profileData.followers)
        setFollowing(profileData.following)
        setProfilePhoto(my_api + "/photo/"+profileData.photo)
        setIsFollwed(profileData.isFollowed)
      }
    }
    fetchProfileData();
    console.log(user)
    return () => {
      isMounted.current = false;
    };
    
  }, [user]);

  const back = () => {
    history.goBack();
  }
  const followUser = () => {
    follow(user)
    if(isFollowed){
      setFollowers(followers-1)
    }else setFollowers(followers+1)
    setIsFollwed(!isFollowed)
    
  }


  return {
    following,
    followers,
    gender,
    fullname,
    profilePhoto,
    follows,
    photos,
    isOwn,
    back,
    isFollowed,
    followUser
  };
};

export default useProfile;
