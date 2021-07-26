import { FaArrowLeft, FaBars, FaBell, FaEnvelope, FaEnvelopeSquare, FaHome, FaSearch, FaUsers } from "react-icons/fa";
import './style.css'
import Post from '../../components/post/post'
import mylove from '../../res/images/mylove.jpg'
import mylove1 from '../../res/images/mylove1.jpg'
import User from '../../components/people/user'
function Follower(){
    return(
        <>
        <header className="follower-header">
            <nav><FaArrowLeft className = "back-icon"></FaArrowLeft></nav>
            <h3 className = "account-name">Emmanuel Katipunan</h3>
            <button className = "search-button"><FaSearch className = "search-icon"></FaSearch></button>

      </header>
      <div className = "follower-body">
          <h4>300 Followers</h4>
          <div className = "people-list-div">
             <User></User>
             <User></User>
             <User></User>
          </div>
      </div>
</>
    )
}
export default Follower