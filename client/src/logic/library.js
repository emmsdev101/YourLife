import {FaUserShield,FaHandshake, FaSignOutAlt,FaCogs, FaQuestionCircle,FaCamera,FaArrowLeft, FaUserPlus,FaPen, FaComment, FaEllipsisH, FaThumbsUp, FaUserCircle, FaBars, FaBell, FaPlusCircle, FaEnvelope, FaHome, FaUsers, FaSearch, FaImages,FaVideo  } from 'react-icons/fa'
import {useState, useEffect, useContext, useRef} from 'react'
import { useHistory } from "react-router-dom";
import axios from 'axios';
import useFeed from './useFeed'
import usePeople from './usePeople'
import { GlobalUserContext } from './userContext'
import { GlobalUserActionsContext } from "./userContext";
import Cookies from "universal-cookie";
export const useIcons = () => {
    return{FaUserShield,FaHandshake, FaSignOutAlt,FaCogs, FaQuestionCircle,FaComment, FaEllipsisH, FaThumbsUp, FaUserCircle, FaBars, FaBell, FaPlusCircle, FaEnvelope, FaHome, FaUsers, FaSearch, FaCamera,FaArrowLeft, FaUserPlus,FaPen, FaImages,FaVideo }
}
export const useReactHooks = () => {
    return {useState, useContext, useRef, useHistory,useEffect, Cookies, axios}
}
export const useCustomHooks = () => {
    return {useFeed,usePeople,GlobalUserContext, GlobalUserActionsContext }
}


