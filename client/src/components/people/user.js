import { FaUserCircle } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import style from './user.module.css'
import useUser from './useUser';
function User({data, id, isSearching, selectUser, page}){
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
    const selectedUser = () => {
       if(page === 'chat'){
        selectUser(data)
       }else{
           viewProfile()
       }
    }
    if(isSearching){
        return(
            <div className = {style.userDiv} id = {id} onClick = {selectedUser}>
                {dpLoad? <img className = {style.userPictureSmall} src = {profilePhoto}></img>:
                <FaUserCircle className = {style.userPictureSmall}/>}
                <div className = {style.userDetails}>
                    <p className = {style.username}>{data.firstname + ' ' + data.lastname}</p>
                </div>
            </div>
        )
    }
    else if(followed !== null) return(
        <div className = {style.userDiv} id = {id}>
            {dpLoad? <img className = {style.userPicture} src = {profilePhoto} onClick = {selectedUser}></img>:
            <FaUserCircle className = {style.userPicture} onClick = {selectedUser}/>}
            <div className = {style.userDetails}>
                <p className = {style.username} onClick = {selectedUser}>{data.firstname + ' ' + data.lastname}</p>
                <p className = {style.userStatus}>Followers {data.followers}</p>
                <div className = {style.followDiv}><button disabled = {followed} ref = {follow_btn} className = {!followed?style.followUser:style.followingUser} onClick = {followUser}>{followed?"Following":"Follow"}</button>
                {followed?<button ref = {unfollow_btn} onClick = {followUser} className = {style.userRemove}>Unfollow</button>:''}</div>
            </div>
        </div>
    )
    else return(<></>)
}
export default User