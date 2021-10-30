import { FaUserCircle } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import style from './user.module.css'
import useUser from './useUser';
function User({data, id, isSearching}){
    const history = useHistory()
    const {followed,
        dpLoad,
        profilePhoto,
        followUser,
        unfollow_btn,
        follow_btn
    } = useUser(data, id)

    const viewProfile = ()=> {
        history.push("/profile/"+data.username)
    }
    if(isSearching){
        return(
            <div className = {style.userDiv} id = {id}>
                {dpLoad? <img className = {style.userPicture} src = {profilePhoto} onClick = {viewProfile}></img>:
                <FaUserCircle className = {style.userPicture} onClick = {viewProfile}/>}
                <div className = {style.userDetails}>
                    <p className = {style.username} onClick = {viewProfile}>{data.firstname + ' ' + data.lastname}</p>
                </div>
            </div>
        )
    }
    else if(followed !== null) return(
        <div className = {style.userDiv} id = {id}>
            {dpLoad? <img className = {style.userPicture} src = {profilePhoto} onClick = {viewProfile}></img>:
            <FaUserCircle className = {style.userPicture} onClick = {viewProfile}/>}
            <div className = {style.userDetails}>
                <p className = {style.username} onClick = {viewProfile}>{data.firstname + ' ' + data.lastname}</p>
                <p className = {style.userStatus}>Followers {data.followers}</p>
                <div className = {style.followDiv}><button disabled = {followed} ref = {follow_btn} className = {!followed?style.followUser:style.followingUser} onClick = {followUser}>{followed?"Following":"Follow"}</button>
                {followed?<button ref = {unfollow_btn} onClick = {followUser} className = {style.userRemove}>Unfollow</button>:''}</div>
            </div>
        </div>
    )
    else return(<></>)
}
export default User