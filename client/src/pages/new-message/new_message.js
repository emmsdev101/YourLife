import { FaArrowLeft, FaBars, FaBell, FaEnvelope, FaEnvelopeSquare, FaHome, FaPen, FaSearch, FaUsers } from "react-icons/fa";
import './style.css'
import Post from '../../components/post/post'
import mylove from '../../res/images/mylove.jpg'
import mylove1 from '../../res/images/mylove1.jpg'
import User from '../../components/people/user'
import image1 from '../../res/images/mylove.jpg'
import './style.css'
function Chat(){
const Reciever = ({unread}) => {
    return(<>
        <div className = {unread? "inbox-div unread":"inbox-div"}>
            <img className = "inbox-picture" src = {image1}></img>
            <div className = "inbox-detail">
                <p className = "inbox-name">Jonalyn Garder</p>
            </div>
        </div>

    </>)
}
    return(
        <>
        <header className="chat-header">
            <div className = "nav">
                <nav><FaArrowLeft className = "back-icon"></FaArrowLeft></nav>
                <h3 className = "page-title">New message</h3>
                </div>
            <div className = "search-div">
                <input type = "text" placeholder = "Type a name:"></input>
                <FaSearch></FaSearch>
            </div>
      </header>
      <div className = "chat-body">
        <Reciever></Reciever>
        <Reciever></Reciever>
        <Reciever></Reciever>
      </div>
</>
    )
}
export default Chat