import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import usePeople from "../../logic/usePeople";

const useUser = (data, id) => {
  const my_api =
    process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";
  const profilePhoto = my_api + "/photo/" + data.photo;

  const { follow, isFollowing } = usePeople();
  const [dpLoad, setDpLoad] = useState(false);
  const [followed, setFollow] = useState(null);

  const follow_btn = useRef(null);
  const unfollow_btn = useRef(null);

  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    let preload = new Image();
    preload.onload = () => {
      if (isMounted) setDpLoad(true);
    };
    checkFollow();
    preload.src = profilePhoto;
    return () => {
      setIsMounted(false);
    };
  }, []);

  async function checkFollow() {
    if (await isFollowing(data.username)) {
      if (isMounted) setFollow(true);
    } else {
      if (isMounted) setFollow(false);
    }
  }
  const followUser = async () => {
    if (followed) {
      follow_btn.current.disabled = false;
      if (isMounted) follow(data.username, data._id);
    } else {
      if (isMounted) follow(data.username,data._id);
      follow_btn.current.disabled = true;
    }
    setFollow(!followed);
  };
  return {
    followed,
    dpLoad,
    profilePhoto,
    followUser,
    unfollow_btn,
    follow_btn,
  };
};
export default useUser;
