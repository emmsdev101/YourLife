import image1 from '../../res/images/mylove.jpg'
import './style.css'
function NotificationItem({unread}){
    return(<>
        <div className = {unread? "notification-div unread":"notification-div"}>
            <img className = "notification-picture" src = {image1}></img>
            <div className = "notification-detail">
                <p className = "notification-name">Jonalyn Garder</p>
                <p className = "notification-content">Commented on  your photo: "Gwapo ungoy koba"</p>
                <p className = "notification-status">1 hour ago</p>
            </div>
        </div>

    </>)
}
export default NotificationItem