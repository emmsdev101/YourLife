import { useIcons } from '../../logic/library';
import './style.css'
function User({data, id}){
    const {FaUserCircle} = useIcons()
    const my_api = process.env.NODE_ENV === 'development'? 'http://localhost:4000' : ''
    const profilePhoto = my_api + "/photos/"+data.photo;
    return(
        <div className = "user-div" id = {id}>
            {data.photo !== undefined? <img className = "user-picture" src = {profilePhoto}></img>:
            <FaUserCircle className = "user-picture"/>}
            <div className = "user-detail">
                <p className = "user-name">{data.firstname + ' ' + data.lastname}</p>
                <p className = "user-status">Followers {data.followers}</p>
                <button className = "user-follow">Follow</button>
                <button className = "user-remove">Remove</button>
            </div>
        </div>
    )
}
export default User