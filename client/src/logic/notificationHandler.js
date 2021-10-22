
import {  useState } from "react"
const NotificationHandler = () =>{

    const [notifications, setNotifications] = useState(null)

    return {notifications, setNotifications}
}
export default NotificationHandler