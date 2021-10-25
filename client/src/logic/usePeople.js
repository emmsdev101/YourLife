import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie/es6";
const cookie = new Cookies();
function usePeople() {
  const my_api =
    process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";
  
  const fetchPoeple = async (page) => {
    try {
      const fetch_res = await axios({
        method: "get",
        withCredentials: true,
        url: my_api + "/user/fetchAll",
        params:{page}
      });
      if (fetch_res.status === 200) {
          return fetch_res.data
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          cookie.remove("username");
          window.location.replace("/login")
          return null;
        }
      }
    }
  };
  const searchPeople = async (toSearch) => {
    try {
      const fetch_res = await axios({
        method: "get",
        withCredentials: true,
        url: my_api + "/user/search",
        params:{toSearch}
      });
      if (fetch_res.status === 200) {
          return fetch_res.data
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          cookie.remove("username");
          window.location.replace("/login")
          return null;
        }
      }
    }
  };
  const searchFollower = async (toSearch) => {
    try {
      const fetch_res = await axios({
        method: "get",
        withCredentials: true,
        url: my_api + "/user/search-follower",
        params:{toSearch}
      });
      if (fetch_res.status === 200) {
          return fetch_res.data
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          cookie.remove("username");
          window.location.replace("/login")
          return null;
        }
      }
    }
  };
  const getUserInfo = async (username) => {
    try {
      const url = username? my_api + "/user/profile": my_api + "/user/account"
      const userInfo = await axios({
        method: "get",
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        url: url,
        params : {username}
      });
      if (userInfo.status === 200) {
        return userInfo.data;
      } else {
        console.log(userInfo.status);
        return null;
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          cookie.remove("username");
          window.location.replace("/login")
          return null;
        }
      }
    }
  };
  const fetchPhotos = async (user) => {
    console.log(user)
    const url = my_api + "/photo/my-photos"
    try {
      const fetchResult = await axios({
        method: "GET",
        withCredentials: true,
        url: url,
        params: {username:user}
      });
      if (fetchResult.status === 200) {
        return fetchResult.data;
      } else if (fetchResult.status === 401) {
      } else {
        console.log(fetchResult.status);
        return null;
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          cookie.remove("username");
          window.location.replace("/login")
          return null;
        }
      }
    }
  };

  const fetchGalerry = async(user) => {
    try {
      const fetchResult = await axios({
        method: "GET",
        withCredentials: true,
        url: my_api + "/photo/my-gallery",
        params: {username:user}
      });
      if (fetchResult.status === 200) {
        return fetchResult.data;
      } else if (fetchResult.status === 401) {
      } else {
        console.log(fetchResult.status);
        return null;
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          cookie.remove("username");
          window.location.replace("/login")
          return null;
        }
      }
    }
  }
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
      } else if (updateProfile.status === 401) {
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          cookie.remove("username");
          window.location.replace("/login")
          return null;
        }
      }
    }
  };
  const follow = async (username,user_id) => {
    try {
      const follow_request = await axios({
        method: "post",
        withCredentials: "true",
        headers: { "Content-Type": "application/json" },
        url: my_api + "/user/follow",
        data: {
          username: username,
          user_id:user_id
        },
      });
      if (follow_request.status === 200) {
        console.log(follow_request.data);
        if (follow_request.data === true) console.log(follow_request.data);
        else return false;
      } 
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          cookie.remove("username");
          window.location.replace("/login")
          return null;
        }
      }
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
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          cookie.remove("username");
          window.location.replace("/login")
          return null;
        }
      }
    }
  };
  const getFollowing = async (limit, page, user) => {
    try {
      const followers = await axios({
        method: "get",
        headers: { "Content-type": "application/json" },
        withCredentials: true,
        url: my_api + "/user/followers",
        params : {limit:limit, page:page, username:user}
      });
      if (followers.status === 200) {
        return followers.data;
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          cookie.remove("username");
          window.location.replace("/login")
          return null;
        }
      }
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
      } else if (followStatus.status === 401) {
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          cookie.remove("username");
          window.location.replace("/login")
          return null;
        }
      }
    }
  };
  return {
    fetchPoeple,
    getUserInfo,
    fetchPhotos,
    updateDp,
    follow,
    isFollowing,
    getFollowing,
    getFollowStatus,
    fetchGalerry,
    searchPeople,
    searchFollower
  };
}
export default usePeople;
