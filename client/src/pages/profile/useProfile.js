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
import { MY_API } from "../../config";

const cookie = new Cookies();
const useProfile = () => {
  const params = useParams()
  const user = params.username
  const owner = cookie.get("username");
  const my_api = MY_API
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
  const [_id, setId] = useState(null)

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
      const following = await getFollowing(6,0,isOwn?null:user);
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
        setId(profileData._id)
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
    follow(user,_id)
    if(isFollowed){
      setFollowers(followers-1)
    }else setFollowers(followers+1)
    setIsFollwed(!isFollowed)
    
  }
  const messageProfile = () => {
    history.push("/sendMessage/"+_id)
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
    followUser,
    messageProfile
  };
};
export default useProfile;
