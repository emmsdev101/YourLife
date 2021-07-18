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
      <div className = "people-body">
          <div className = "people-header">
              <h3>Notification</h3>
              <button className = "search-button"><FaSearch className = "search-icon"></FaSearch></button>
          </div>
          <div className = "people-list-div">
              <h3>Comming soon....</h3>
              
          
          </div>
      </div>    )
}
export default Notification