import './style.css'
import './style.css'
import { useIcons } from '../../logic/library'
function Chat({setOpen}){
    const { FaArrowLeft, FaCamera, FaEllipsisV, FaImage, FaPaperPlane } = useIcons()
    
    const MessageItem = ({isme, id}) => {
        return(
            <div className = {isme? "msg-div me": "msg-div"} id = {id}>
                <p className = "msg-content">Bacon Powder</p>
            </div>
            )
    }
    return(
        <>
       <div className = "conversation">
       <div className = "conversation-nav">
                <div className = "conversation-back" onClick = {()=>{setOpen(false)}}><FaArrowLeft className = "back-icon"></FaArrowLeft></div>
                <img className = "reciever-picture"></img>
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