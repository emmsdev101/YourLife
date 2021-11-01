import { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import useFeed from "./logic/useFeed";
import { SocketContext } from "./logic/socketHandler";
import { MY_API } from "./config";
import {
  GlobalUserActionsContext,
  GlobalUserContext,
} from "./logic/userContext";
import axios from "axios";
const cookie = new Cookies();
const username = cookie.get("username");

const useApp = () => {
  const my_api = MY_API
  const { fetchFeeds, generateFeeds } = useFeed();
  const location = useLocation();
  const setUserContext = useContext(GlobalUserActionsContext);
  const socket = useContext(SocketContext);
  const userContext = useContext(GlobalUserContext);

  const [renderHeader, setRenderHeader] = useState(true);
  const [stories, setStories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(null);
  const [chats, setChats] = useState([])
  const [notifLoaded, setNotifLoaded] = useState(false);
  const [chatsLoaded, setChatsLoaded] = useState(false)

  const [page, setPage] = useState(1);
  let refreshed = useRef(false);

  useEffect(() => {
    if (isLogged()) {
     initializeFeed();
    setUserContext();
    }
  }, []);
  useEffect(() => {
    const curr_path = location.pathname.substring(1);
    if (
      curr_path === "viewpost" ||
      curr_path.substring(0, curr_path.indexOf("/")) === "profile" ||
      curr_path === "profile" ||
      curr_path === "chat"
    ) {
      setRenderHeader(false);
    } else {
      setRenderHeader(true);
    }
  }, [location.pathname]);
  useEffect(() => {
    initNotifications();
    initChats()
    if (userContext._id) {
      socket.emit("connect-me", userContext._id);
    }
  }, [userContext._id]);
  useEffect(() => {
    if (notifLoaded) {
      socket.on("notification", (msg) => {
        console.log(msg)
        if (msg.type === "follow") {
          setNotifications((olds) => [msg, ...olds]);
        } else {
          if (msg.sender !== userContext._id) {
            let existing = notifications.find(
              (item) => item.post_id === msg.post_id && item.type === msg.type
            );
            let oldNotifs = notifications.filter(
              (item) => item.post_id !== msg.post_id && item.type !== msg.type
            );
            if (existing) {
              if (existing.type === "comment") {
                existing.comments = msg.comments;
                existing.seen = false;
              }
              if (existing.type === "like") {
                existing.likers[0] = msg.likers[0];
                existing.seen = false;
                existing.createdAt = msg.createdAt;
              }
              oldNotifs.unshift(existing);
              setNotifications(null);
              setNotifications(oldNotifs);
            } else {
              setNotifications((olds) => [msg, ...olds]);
            }
          }
        }
      });
    }
  }, [notifLoaded]);
  useEffect(() => {
    socket.on('chat', (msg)=>{
      console.log(msg)
      if (msg.sender !== userContext._id) {
        let existing = chats.find(
          (item) => item._id === msg.chat._id
        );
        if(existing){
          console.log("exists", existing)
          let oldChats = chats.filter(
            (item) => item._id !== existing._id
          );
          oldChats.unshift(msg.chat)
          setChats(null)
          setChats(oldChats)
        }else{
          initChats()
        }
      }
    })
  }, [chatsLoaded])
  async function  initializeFeed(){
    const myFeeds = await generateFeeds()
    if(myFeeds){
      setLoading(false)
      setStories(myFeeds)
    }
  }

  async function fetchStory() {
    setLoading(true);
    const fetched_stories = await generateFeeds()
    if (fetched_stories) {
      if (Array.isArray(stories)) {
        if (refreshed.current) setStories(fetched_stories);
        else setStories((feeds) => [...feeds, ...fetched_stories]);
      } else {
        setStories(fetched_stories);
      }
      setLoading(false);
      refreshed.current = true;
    }
  }
  const addFeed = (newFeedPar) => {
    if (Array.isArray(stories)) {
      setStories((feeds) => [newFeedPar, ...feeds]);
    } else {
      setStories([].push(newFeedPar));
    }
  };
  function isLogged() {
    if (username !== undefined) {
      return true;
    } else {
      return false;
    }
  }
  async function initNotifications() {
    setNotifLoaded(false)
    const getNotifications = await axios({
      method: "get",
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
      url: my_api + "/notification",
    });
    setNotifications(getNotifications.data);
    setNotifLoaded(true);
  }
  async function initChats(){
    try {
      const chatRequest =  await axios({
        method:'get',
        url:MY_API + '/chat/inbox',
        withCredentials:true
      })
      if(chatRequest.status === 200){
        console.log(chatRequest.data)
        setChats(chatRequest.data)
        setChatsLoaded(true)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const refreshNotifs = async () => {
    setNotifications([]);
    initNotifications();
  };
  return {
    isLogged,
    renderHeader,
    setRenderHeader,
    stories,
    addFeed,
    fetchStory,
    loading,
    notifications,
    setNotifications,
    refreshNotifs,
    setStories,
    page,
    setPage,
    notifLoaded,
    chats, setChats,
    initChats
  };
};
export default useApp;
