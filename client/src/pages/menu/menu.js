import './style.css'
import image1 from '../../res/images/mylove.jpg'
import { FaCogs,FaHandshake,FaQuestionCircle, FaSignOutAlt, FaUserShield, FaHome, FaUsers, FaBell, FaEnvelope, FaBars} from 'react-icons/fa'
import { useHistory} from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
const API_URL = "https://your-life-amazing.herokuapp.com/user"
const cookie = new Cookies()
function Menu(){
    const history = useHistory()
    function switchPage(page){
        history.push(page)
    }
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
             <header className="home-header">
            <div className = "inactive" onClick = {()=>{switchPage('/home')}}> <FaHome className = "nav-icon"></FaHome></div>
            <div className = "inactive" onClick = {()=>{switchPage('/people')}}><FaUsers className = "nav-icon"></FaUsers></div> 
            <div className = "inactive" onClick = {()=>{switchPage('/notification')}}><FaBell className = "nav-icon"></FaBell></div> 
            <div className = "inactive" onClick = {()=>{switchPage('/chat')}}><FaEnvelope className = "nav-icon"></FaEnvelope></div> 
            <div className = "active" onClick = {()=>{switchPage('/menu')}}><FaBars className = "nav-icon"></FaBars></div>
        </header>
            <h2 className = "menu-title">Menu</h2>
           <div className ="menu-item"onClick = {()=>{switchPage('/profile')}}>
               <img className = "menuitem-img" src = {image1}></img>
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