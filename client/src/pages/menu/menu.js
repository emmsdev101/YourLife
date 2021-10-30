import { useCustomHooks, useIcons, useReactHooks } from '../../logic/library'
import style from './menu.module.css'
import Alert from './../../components/alert/Alert'
import React from 'react'
import {MY_API} from './../../config'
function Menu(){
    const  {useContext, useHistory,useEffect, useState, Cookies, axios} = useReactHooks()
    const {GlobalUserContext} = useCustomHooks()
    const {FaCogs, FaQuestionCircle, FaUserCircle, FaHandshake, FaSignOutAlt, FaHome, FaBell, FaUserShield, FaUsers} = useIcons()
    const cookie = new Cookies()
    const my_api = MY_API
    const API_URL = my_api+"/user"

    const user_context = useContext(GlobalUserContext);
    const [profile_photo_url, setProfilePhotoUrl] = useState(null)

    const history = useHistory()
    const [confirmLogout, setConfirmLogout] = useState(false)

    function switchPage(page){
       history.push(page)
    }
    function cancel(){
        setConfirmLogout(false)
    }
    useEffect(() => {
       let temp_img = new Image()
       const src = my_api+"/photo/"+user_context.photo
       temp_img.onload = () => {
           setProfilePhotoUrl(src)
       }
       temp_img.src = src
    }, []);

    const logout = async()=>{
        const logged_out = await axios({
            method : 'get',
            withCredentials: true,
            url: API_URL+'/logout',
        })
        if(logged_out.status === 200){
            cookie.remove('username')
            window.location.replace('/login')
        }else{
            console.log(logged_out.status)
        }
    }
    const openLogout = ()=>{
        setConfirmLogout(true)
    }
    return(
        <React.Fragment>
            {confirmLogout?<Alert confirm = {logout} cancel = {cancel} message = {"Are you sure you want to log out?"}/>:''}
         <div className = {style.menu}>
           <div className ={style.profile} onClick = {()=>{switchPage('/profile')}}>
           <p className ={style.menuItemTitle}>Your Profile</p>
           { profile_photo_url !== null?<img className = {style.menuitemImg} src = {profile_photo_url}></img>:<FaUserCircle className = {style.altDp}/>}
               <p className = {style.name}>{user_context.firstname}</p>
            </div>
            <p className = {style.title}>Menu</p>
           <div className ={style.menuItem}>
               <FaCogs className = {style.itemIcon}/>
               <p className = {style.menuItemTitle}>Settings</p>
           </div>
           <div className ={style.menuItem}>
               <FaQuestionCircle className = {style.itemIcon}/>
               <p className = {style.menuItemTitle}>Help</p>
           </div>
           <div className ={style.menuItem}>
               <FaUserShield className = {style.itemIcon}/>
               <p className = {style.menuItemTitle}>Report</p>
           </div>
           <div className ={style.menuItem}>
               <FaHandshake className = {style.itemIcon}/>
               <p className = {style.menuItemTitle}>Support</p>
           </div>
           <div className ={style.menuItem} onClick = {openLogout}>
               <FaSignOutAlt className = {style.itemIcon}/>
               <p className = {style.menuItemTitle}>Logout</p>
           </div>
        </div>
        </React.Fragment>
    )
}
export default Menu