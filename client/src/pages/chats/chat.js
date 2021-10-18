import './style.css'
import Conversation from "../Conversation/conversation";
import { useIcons, useReactHooks } from '../../logic/library'
function Chat(){
    const {useHistory, useState} = useReactHooks()
    const {FaArrowLeft,  FaPen, FaSearch} = useIcons()
    const history = useHistory()
    const [onread, setOnread] = useState(false);

    function switchPage(page){
        history.push(page)
    }
const InboxItem = ({unread}) => {

    return(<>
        <div className = {unread? "chat-inbox unread":"chat-inbox"} onClick = {()=>{setOnread(true)}}>
            <img className = "chat-picture" ></img>
            <div className = "chat-detail">
                <p className = "chat-name">Jonalyn Garder</p>
                <p className = "chat-content">Gwapo ungoy koba</p>
                <p className = "chat-status">1 hour ago</p>
            </div>
        </div>

    </>)
}
const Inbox = ()=> {
    return(
        <>
        <header className="chat-header">
            <div className = "chat-nav">
                <nav onClick = {()=>{switchPage("/")}}><FaArrowLeft className = "back-icon"></FaArrowLeft></nav>
                <h3 className = "page-title">Chats</h3>
                <nav className = "new-message"><FaPen></FaPen></nav>
                </div>
      </header>
      <div className = "search-holder">
            <div className = "chat-search">
                <input className = "chat-input" type = "text" placeholder = "Search:"></input>
                <FaSearch></FaSearch>
            </div>
    </div>
      <div className = "chat-body">
          <h3>Comming soon...</h3>

        {/* <InboxItem unread = {true}></InboxItem>
        <InboxItem></InboxItem>
        <InboxItem unread = {true}></InboxItem>
        <InboxItem unread = {true}></InboxItem>
        <InboxItem unread = {true}></InboxItem>
        <InboxItem unread = {true}></InboxItem>
        <InboxItem unread = {true}></InboxItem>
        <InboxItem unread = {true}></InboxItem>
        <InboxItem unread = {true}></InboxItem>
        <InboxItem unread = {true}></InboxItem>
        <InboxItem unread = {true}></InboxItem>
        <InboxItem unread = {true}></InboxItem> */}
      </div>
        </>
        
    )
}
    return(
        <>
        {onread?<Conversation setOpen = {setOnread}/>:
        <Inbox/>}
        
</>
    )
}
export default Chat