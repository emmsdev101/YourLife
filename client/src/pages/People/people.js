import './style.css'
import User from '../../components/people/user'
import { useCustomHooks, useIcons, useReactHooks } from '../../logic/library';
function People(){
    const {FaSearch} = useIcons()
    const {useHistory} = useReactHooks()
    const {usePeople} = useCustomHooks()
    const history = useHistory()
    const {people} = usePeople()

    return(
      <div className = "people-body">
          <div className = "people-header">
              <h3>Follow more</h3>
              <button className = "search-button"><FaSearch className = "search-icon"></FaSearch></button>
          </div>
          <hr></hr>
          <div className = "people-list-div">
             {people.map((user,id)=>(
                 <User  data = {user} key = {id} id = {id}/>
             ))}
          </div>
      </div>
    )
}
export default People