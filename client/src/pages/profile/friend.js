import { useCustomHooks, useReactHooks } from "../../logic/library"
import { MY_API } from "../../config"
import { FaUserCircle } from "react-icons/fa"
const FriendItem = ({follower, id})=> {
    const {useState, useEffect} = useReactHooks()
    const {usePeople} = useCustomHooks()

    const {getUserInfo} = usePeople()
    const [profilePicture, setProfilePicture] = useState(null);
    const my_api = MY_API
    useEffect(() => {
        const picture_url = my_api + "/photo/"+follower.photo
        let picture = new Image()
        picture.onload = () => {
            setProfilePicture(picture_url)
        }
        picture.src = picture_url
    }, []);

return(
    <div className = "friends-item-div" id = {id}>
        {profilePicture?<div className = "friend-image" style = {{backgroundImage:'url('+profilePicture+')'}}></div>:
        <FaUserCircle className = "friend-image"/>}
        <p>{follower.firstname + "" + follower.lastname} </p>
    </div>
            )
}
export default FriendItem