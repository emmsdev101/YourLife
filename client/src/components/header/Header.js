import React from "react";
import { FaBars, FaBell, FaEnvelope, FaHome, FaUser, FaUsers } from "react-icons/fa";
import useHeader from "./useHeader";

const Header = ({notifications}) => {
    const {switchPage, active, newNotifs} = useHeader(notifications)
    return (
      <header className="home-header">
        <div
          className={
            active === "/home" || active === "/" ? "active" : "inactive"
          }
          onClick={() => {
            switchPage("/home");
          }}
        >
          {" "}
          <FaHome className="nav-icon"></FaHome>
        </div>
        <div
          className={active === "/people" ? "active" : "inactive"}
          onClick={() => {
            switchPage("/people");
          }}
        >
          <FaUsers className="nav-icon"></FaUsers>
        </div>
        <div
          className={active === "/notification" ? "active" : "inactive"}
          onClick={() => {
            switchPage("/notification");
          }}
        >
          <FaBell className="nav-icon"></FaBell>
          {newNotifs?<div id = "notificationCount">{newNotifs > 9?'9+':newNotifs}</div>:""}
        </div>
        <div
          className={active === "/chat" ? "active" : "inactive"}
          onClick={() => {
            switchPage("/chat");
          }}
        >
          <FaEnvelope className="nav-icon"></FaEnvelope>
        </div>
        <div
          className={active === "/menu" ? "active" : "inactive"}
          onClick={() => {
            switchPage("/menu");
          }}
        >
          <FaBars className="nav-icon"></FaBars>
        </div>
      </header>
    );
  };
  export default Header