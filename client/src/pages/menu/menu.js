import { useCustomHooks, useIcons, useReactHooks } from '../../logic/library'

import './../../generalStyle/generalStyle.css'
import './menuStyle.css'
import '../home/homeStyle.css'
function Menu(){
    const  {useContext, useHistory,useEffect, useState, Cookies, axios} = useReactHooks()
    const {GlobalUserContext} = useCustomHooks()
    const {FaEnvelope, FaBars, FaCogs, FaQuestionCircle, FaUserCircle, FaHandshake, FaSignOutAlt, FaHome, FaBell, FaUserShield, FaUsers} = useIcons()
    const cookie = new Cookies()
    const my_api = process.env.NODE_ENV === 'development'? 'http://localhost:4000' : ''
    const API_URL = my_api+"/user"

    const user_context = useContext(GlobalUserContext);
    const [profile_photo_url, setProfilePhotoUrl] = useState(null)

    const history = useHistory()

    function switchPage(page){
       history.push(page)
    }
    useEffect(() => {
       let temp_img = new Image()
       temp_img.onload = () => {
           setProfilePhotoUrl(my_api+"/photos/"+user_context.photo)
       }
       temp_img.src = my_api+"/photos/"+user_context.photo
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
            alert('You are logged out')
        }else{
            console.log(logged_out.status)
        }
    }
    return(
         <div className = "menu-div">
            <h2 className = "menu-title">Menu</h2>
           <div className ="menu-item"onClick = {()=>{switchPage('/profile')}}>
           { profile_photo_url !== null?<img className = "menuitem-img" src = {profile_photo_url}></img>:<FaUserCircle className = "alt-dp"/>}
               <strong><p className = "menuitem-title">See your profile</p></strong>
            </div>
           <div className ="menu-item">
               <FaCogs className = "item-icon"/>
               <p className = "menuitem-title">Settings</p>
           </div>
           <div className ="menu-item">
               <FaQuestionCircle className = "item-icon"/>
               <p className = "menuitem-title">Help</p>
           </div>
           <div className ="menu-item">
               <FaUserShield className = "item-icon"/>
               <p className = "menuitem-title">Report</p>
           </div>
           <div className ="menu-item">
               <FaHandshake className = "item-icon"/>
               <p className = "menuitem-title">Support</p>
           </div>
           <div className ="menu-item" onClick = {logout}>
               <FaSignOutAlt className = "item-icon"/>
               <p className = "menuitem-title">Logout</p>
           </div>
        </div>
    )
}
export default Menu