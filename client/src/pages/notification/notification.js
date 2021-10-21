import './style.css'
import NotificationItem from '../../components/notification/notification'
import { useIcons, useReactHooks } from '../../logic/library'
import useNotification from './useNotification'
import { Suspense, lazy} from 'react'

const ViewPost = lazy(() => import("../../components/post/viewPost"));
function Notification({setRenderHeader}){
    const {FaSearch} = useIcons()
    const {useHistory} = useReactHooks()
    const {notifications,viewNotification, setViewNotification, closePost} = useNotification(setRenderHeader)
    
    const history = useHistory()
    function switchPage(page){
        history.push(page)
    }
    if (viewNotification){
        return (
          <Suspense fallback={<div>Loading</div>}>
            <ViewPost id={viewNotification} back={closePost} setRenderHeader={null} />
          </Suspense>
        )
      }
    else return(
      <div className = "people-body">
          <div className = "people-header">
              <h3>Notification</h3>
              <button className = "search-button"><FaSearch className = "search-icon"></FaSearch></button>
          </div>
          <div className = "people-list-div">
            <br/>
            {!notifications?"loading notifications...":
              notifications.length<1?"You have no notifications":""
            }
              {notifications?.map((item, id)=>(
                  <NotificationItem notification = {item} setRenderHeader = {setRenderHeader} setViewNotification={setViewNotification} openProfile = {switchPage} key = {id}></NotificationItem>
              ))}
          </div>
      </div>    )
}
export default Notification