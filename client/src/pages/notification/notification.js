import './style.css'
import NotificationItem from '../../components/notification/notification'
import { useIcons, useReactHooks } from '../../logic/library'
function Notification(){
    const {FaBars, FaBell, FaEnvelope, FaHome, FaSearch, FaUsers} = useIcons()
    const {useHistory} = useReactHooks()
    const history = useHistory()
    function switchPage(page){
        history.push(page)
    }
    return(
        <>
        <header className="home-header">
            <div className = "inactive" onClick = {()=>{switchPage('/home')}}> <FaHome className = "nav-icon"></FaHome></div>
            <div className = "inactive" onClick = {()=>{switchPage('/people')}}><FaUsers className = "nav-icon"></FaUsers></div> 
            <div className = "active" onClick = {()=>{switchPage('/notification')}}><FaBell className = "nav-icon"></FaBell></div> 
            <div className = "inactive" onClick = {()=>{switchPage('/chat')}}><FaEnvelope className = "nav-icon"></FaEnvelope></div> 
            <div className = "inactive" onClick = {()=>{switchPage('/menu')}}><FaBars className = "nav-icon"></FaBars></div>
        </header> 
      <div className = "people-body">
          <div className = "people-header">
              <h3>Notification</h3>
              <button className = "search-button"><FaSearch className = "search-icon"></FaSearch></button>
          </div>
          <div className = "people-list-div">
                <NotificationItem unread = {true}></NotificationItem>
                <NotificationItem></NotificationItem>
                <NotificationItem  unread = {true}></NotificationItem>
                <NotificationItem></NotificationItem>
          </div>
      </div>
</>
    )
}
export default Notification