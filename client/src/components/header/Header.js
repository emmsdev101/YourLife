import React from "react";
import { FaBars, FaBell, FaEnvelope, FaHome, FaUser, FaUsers } from "react-icons/fa";
import useHeader from "./useHeader";
import style from './header.module.css'

const Header = ({notifications, chats}) => {
    const {switchPage, active, newNotifs, newChats} = useHeader(notifications, chats)
    return (
      <header className={style.homeHeader}>
        <div
          className={
            active === "/home" || active === "/" ? style.active : style.inactive
          }
          onClick={() => {
            switchPage("/home");
          }}
        >
          {" "}
          <FaHome className={style.navIcon}></FaHome>
        </div>
        <div
          className={active === "/people" ? style.active:style.inactive}
          onClick={() => {
            switchPage("/people");
          }}
        >
          <FaUsers className={style.navIcon}></FaUsers>
        </div>
        <div
          className={active === "/notification" ? style.active:style.inactive}
          onClick={() => {
            switchPage("/notification");
          }}
        >
          <FaBell className={style.navIcon}></FaBell>
          {newNotifs?<div className={style.notificationCount}>{newNotifs > 9?'9+':newNotifs}</div>:""}
        </div>
        <div
          className={active === "/chat" ? style.active:style.inactive}
          onClick={() => {
            switchPage("/chat");
          }}
        >
          <FaEnvelope className={style.navIcon}></FaEnvelope>
          {newChats?<div className={style.notificationCount}>{newChats > 9?'9+':newChats}</div>:""}
        </div>
        <div
          className={active === "/menu" ? style.active:style.inactive}
          onClick={() => {
            switchPage("/menu");
          }}
        >
          <FaBars className={style.navIcon}></FaBars>
        </div>
      </header>
    );
  };
  export default Header