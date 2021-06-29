import { FaArrowLeft, FaBars, FaBell, FaCamera, FaEllipsisV, FaEnvelope, FaEnvelopeSquare, FaHome, FaImage, FaPaperPlane, FaPen, FaPhotoVideo, FaSearch, FaUsers } from "react-icons/fa";
import './style.css'
import Post from '../../components/post/post'
import mylove from '../../res/images/mylove.jpg'
import mylove1 from '../../res/images/mylove1.jpg'
import User from '../../components/people/user'
import image1 from '../../res/images/mylove.jpg'
import image2 from '../../res/images/test1.jpg'
import './style.css'
function Chat({setOpen}){
const MessageItem = ({isme}) => {
    return(<>
        <div className = {isme? "msg-div me": "msg-div"}>
            <p className = "msg-content">Bacon Powder</p>
        </div>

    </>)
}
    return(
        <>

       <div className = "conversation">
       <div className = "conversation-nav">
                <div className = "conversation-back" onClick = {()=>{setOpen(false)}}><FaArrowLeft className = "back-icon"></FaArrowLeft></div>
                <img className = "reciever-picture" src = {image2}></img>
                <h3 className = "reciever-name">Bacon Powder</h3>
                <div className = "conversation-back"><FaEllipsisV></FaEllipsisV></div>
            </div>
      <div className = "convo-body">
            <MessageItem isme = {true}></MessageItem>
            <MessageItem isme = {false}></MessageItem>
            <MessageItem isme = {true}></MessageItem>
            <MessageItem isme = {true}></MessageItem>
            <MessageItem isme = {false}></MessageItem>
            <MessageItem isme = {true}></MessageItem>
      </div>
      <div className = "message-inputs">
          <div className = "photo-div"><FaCamera className = "photo-icon"></FaCamera></div>
          <div className = "photo-div"><FaImage className = "photo-icon"></FaImage></div>
          <input type = "text"></input>
          <button className = "send-btn"><FaPaperPlane className = "send-icon"></FaPaperPlane></button>
      </div>
       </div>
</>
    )
}
export default Chat