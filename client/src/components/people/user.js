import { FaUserCircle } from 'react-icons/fa';
import './style.css'
function User({data}){
    const my_api = process.env.NODE_ENV === 'development'? 'http://localhost:4000' : ''
    const profilePhoto = my_api + "/photos/"+data.photo;
    return(<>
        <div className = "user-div">
            {data.photo !== undefined? <img className = "user-picture" src = {profilePhoto}></img>:
            <FaUserCircle className = "user-picture"/>}
            <div className = "user-detail">
                <p className = "user-name">{data.firstname + ' ' + data.lastname}</p>
                <p className = "user-status">Follower </p>
                <button className = "user-follow">Follow</button>
                <button className = "user-remove">Remove</button>
            </div>
        </div>

    </>)
}
export default User