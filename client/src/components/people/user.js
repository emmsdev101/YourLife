import image1 from '../../res/images/mylove.jpg'
import './style.css'
function User(){
    return(<>
        <div className = "user-div">
            <img className = "user-picture" src = {image1}></img>
            <div className = "user-detail">
                <p className = "user-name">Jonalyn Garder</p>
                <p className = "user-status">Follower 1.5M</p>
                <button className = "user-follow">Follow</button>
                <button className = "user-remove">Remove</button>
           
            </div>
        </div>

    </>)
}
export default User