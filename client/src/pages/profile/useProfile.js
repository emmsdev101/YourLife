import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import useFeed from "../../logic/useFeed";
import usePeople from "../../logic/usePeople";
import {
  GlobalUserActionsContext,
  GlobalUserContext,
} from "../../logic/userContext";
import Cookies from "universal-cookie";

const useProfile = () => {
  const cookie = new Cookies();
  const owner = cookie.get("username");
  const my_api =
    process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";
  let isOwn = true;
  const history = useHistory();
  const user_context = useContext(GlobalUserContext);
  const set_user_context = useContext(GlobalUserActionsContext);

  const { fetchPhotos, getFollowing } = usePeople();

  const [photos, setPhotos] = useState(null);
  const [follows, setFollows] = useState(null);
  const [openPhotos, setOpenPhotos] = useState(false)
  const fullname = user_context.firstname + " " + user_context.lastname;
  const gender = user_context.gender;
  const followers = user_context.followers;
  const following = user_context.following;

  let isMounted = useRef(true);

  useEffect(() => {
    if (user_context.username === undefined) {
      set_user_context(owner);
    }
    async function fetchProfileData() {
      const following = await getFollowing();
      const fetchResult = await fetchPhotos(user_context.username);
      if (isMounted.current) {
        setPhotos(fetchResult);
        setFollows(following);
      }
    }
    fetchProfileData();
    return () => {
      isMounted.current = false;
    };
  }, []);

  const back = () => {
    history.goBack();
  }
  const seePhotos = () => {
    setOpenPhotos(!openPhotos)
  }


  return {
    following,
    followers,
    gender,
    fullname,
    follows,
    photos,
    isOwn,
    back,
    seePhotos,
    openPhotos
  };
};

export default useProfile;
