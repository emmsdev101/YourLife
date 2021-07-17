import {useCustomHooks, useIcons, useReactHooks} from '../../logic/library';
import './style.css'
function User({data, id}){
    const {useState, useEffect, useRef} = useReactHooks()
    const {usePeople } = useCustomHooks()
    const {FaUserCircle} = useIcons()
    const my_api = process.env.NODE_ENV === 'development'? 'http://localhost:4000' : ''
    const profilePhoto = my_api + "/photos/"+data.photo;

    const {follow, isFollowing} = usePeople()
    const [dpLoad, setDpLoad] = useState(false);
    const [followed, setFollow] = useState(null)

    const follow_btn = useRef(null)
    const unfollow_btn = useRef(null)

    useEffect(() => {
        let preload = new Image()
        preload.onload = () => {
            setDpLoad(true)
        }
        checkFollow()
        preload.src = profilePhoto
    }, []);

    async function checkFollow() {
        if(await isFollowing(data.username)){
            setFollow(true)
        }else{
            setFollow(false)
        }
    }
    const followUser = async() => {
        if(followed){
            follow_btn.current.disabled = false
            follow(data.username)          
        }else{
            follow(data.username)
            follow_btn.current.disabled = true
        }
        setFollow(!followed)
    }

    if(followed !== null) return(
        <div className = "user-div" id = {id}>
            {dpLoad? <img className = "user-picture" src = {profilePhoto}></img>:
            <FaUserCircle className = "user-picture"/>}
            <div className = "user-detail">
                <p className = "user-name">{data.firstname + ' ' + data.lastname}</p>
                <p className = "user-status">Followers {data.followers}</p>
                <button disabled = {followed} ref = {follow_btn} className = {!followed?"user-follow":"user-unfollow"} onClick = {followUser}>{followed?"Following":"Follow"}</button>
                {followed?<button ref = {unfollow_btn} onClick = {followUser} className = "user-remove">Unfollow</button>:''}
            </div>
        </div>
    )
    else return(<></>)
}
export default User