import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie/es6";
const cookie = new Cookies();
function usePeople() {
  const my_api =
    process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";
  const [people, setPoeple] = useState([]);

  useEffect(() => {
    fetchPoeple();
  }, []);

  const fetchPoeple = async () => {
    try {
      const fetch_res = await axios({
        method: "get",
        withCredentials: true,
        url: my_api + "/user/fetchAll",
      });
      if (fetch_res.status === 200) {
        setPoeple(fetch_res.data);
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          alert("Your session has expired! Please login again");
          cookie.remove("username");
          return null;
        }
      }
    }
  };
  const getUserInfo = async () => {
    try {
      const userInfo = await axios({
        method: "get",
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        url: my_api + "/user/account",
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
          alert("Your session has expired! Please login again");
          cookie.remove("username");
          return null;
        }
      }
    }
  };
  const fetchPhotos = async (user_context) => {
    try {
      const fetchResult = await axios({
        method: "GET",
        withCredentials: true,
        url: my_api + "/photo/my-photos",
        params: { id: user_context },
      });
      if (fetchResult.status === 200) {
        return fetchResult.data;
      } else if (fetchResult.status === 401) {
        alert("Your session has expired! Please login again");
      } else {
        console.log(fetchResult.status);
        return null;
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          alert("Your session has expired! Please login again");
          cookie.remove("username");
          return null;
        }
      }
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
      } else if (updateProfile.status === 401) {
        alert("Your session has expired! Please login again");
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          alert("Your session has expired! Please login again");
          cookie.remove("username");
          return null;
        }
      }
    }
  };
  const follow = async (username) => {
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
      } else if (follow_request.status === 401) {
        alert("Your session has expired! Please login again");
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          alert("Your session has expired! Please login again");
          cookie.remove("username");
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
      } else if (isFollowingReq.status === 401) {
        alert("Your session has expired! Please login again");
      } else {
        console.log(isFollowingReq.status);
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          alert("Your session has expired! Please login again");
          cookie.remove("username");
          return null;
        }
      }
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
      } else if (followers.status === 401) {
        alert("Your session has expired! Please login again");
        return [];
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          alert("Your session has expired! Please login again");
          cookie.remove("username");
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
        alert("Your session has expired! Please login again");
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          alert("Your session has expired! Please login again");
          cookie.remove("username");
          return null;
        }
      }
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
