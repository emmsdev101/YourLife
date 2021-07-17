import { useCustomHooks, useReactHooks } from "../../logic/library"

const FriendItem = ({id, username})=> {
    const {useState, useEffect} = useReactHooks()
    const {usePeople} = useCustomHooks()

    const {getUserInfo} = usePeople()
    const [profilePicture, setProfilePicture] = useState(null);
    const [userInfo, setUserInfo] = useState({})
    const my_api = process.env.NODE_ENV === 'development'? 'http://localhost:4000' : ''
    useEffect(() => {
        getUserInfo(username).then((result)=>{
            setUserInfo(result)
            console.log(result)
            const picture_url = my_api + "/photos/"+result.photo
            let picture = new Image()
            picture.onload = () => {
                setProfilePicture(picture_url)
            }
            picture.src = picture_url

        })
    }, []);

    if(userInfo !== null)return(
        <div className = "friends-item-div" id = {id}>
            <div className = "friend-image" style = {{backgroundImage:'url('+profilePicture+')'}}></div>
            <p>{userInfo.firstname + "" + userInfo.lastname} </p>
        </div>
            )
    else return(<></>)
}
export default FriendItem