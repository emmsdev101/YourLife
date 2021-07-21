import { useState, useEffect } from "react";
import axios from "axios";
function usePeople() {
  const my_api =
    process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";
  const [people, setPoeple] = useState([]);

  useEffect(() => {
    fetchPoeple();
  }, []);

  const fetchPoeple = async () => {
    const fetch_res = await axios({
      method: "get",
      withCredentials: true,
      url: my_api + "/user/fetchAll",
    });
    if (fetch_res.status === 200) {
      setPoeple(fetch_res.data);
    }
  };
  const getUserInfo = async (username) => {
    const userInfo = await axios({
      method: "get",
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
      url: my_api + "/user/account",
      params: {
        id: username,
      },
    });
    if (userInfo.status === 200) {
      return userInfo.data;
    } else {
      console.log(userInfo.status);
      return null;
    }
  };
  const fetchPhotos = async (user_context) => {
    const fetchResult = await axios({
      method: "GET",
      withCredentials: true,
      url: my_api + "/photo/my-photos",
      params: { id: user_context },
    });
    if (fetchResult.status === 200) {
      return fetchResult.data;
    } else {
      console.log(fetchResult.status);
      return null;
    }
  };
  const updateDp = async (image_path, username) => {
    try {
      const updateProfile = await axios({
        method: "put",
        withCredentials: true,
        url: my_api + "/user/update-dp",
        data: {
          username: username,
          path: image_path,
        },
      });
      if (updateProfile.status === 200) {
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const follow = async (username) => {
    console.log(username);
    try {
      const follow_request = await axios({
        method: "post",
        withCredentials: "true",
        headers: { "Content-Type": "application/json" },
        url: my_api + "/user/follow",
        data: {
          username: username,
        },
      });
      if (follow_request.status === 200) {
        console.log(follow_request.data);
        if (follow_request.data === true) console.log(follow_request.data);
        else return false;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const isFollowing = async (username) => {
    try {
      const isFollowingReq = await axios({
        method: "get",
        headers: { "Content-type": "application/json" },
        withCredentials: true,
        url: my_api + "/user/isfollowing",
        params: { username: username },
      });
      if (isFollowingReq.status === 200) {
        return isFollowingReq.data;
      } else {
        console.log(isFollowingReq.status);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getFollowing = async () => {
    try {
      const followers = await axios({
        method: "get",
        headers: { "Content-type": "application/json" },
        withCredentials: true,
        url: my_api + "/user/followers",
      });
      if (followers.status === 200) {
        return followers.data;
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getFollowStatus = async () => {
    try {
      const followStatus = await axios({
        method: "get",
        headers: { "Content-type": "application/json" },
        withCredentials: true,
        url: my_api + "/user/status",
      });
      if (followStatus.status === 200) {
        return followStatus.data;
      }
    } catch (err) {
      console.log(err);
    }
  };
  return {
    people,
    getUserInfo,
    fetchPhotos,
    updateDp,
    follow,
    isFollowing,
    getFollowing,
    getFollowStatus,
  };
}
export default usePeople;
