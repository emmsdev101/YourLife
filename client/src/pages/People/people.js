import './style.css'
import User from '../../components/people/user'
import { useCustomHooks, useIcons, useReactHooks } from '../../logic/library';
function People(){
    const {FaBars, FaBell, FaEnvelope, FaHome, FaSearch, FaUsers} = useIcons()
    const {useHistory} = useReactHooks()
    const {usePeople} = useCustomHooks()
    const history = useHistory()
    const {people} = usePeople()
    function switchPage(page){
        history.push(page)
    }
    return(
        <>
         <header className="home-header">
            <div className = "inactive" onClick = {()=>{switchPage('/home')}}> <FaHome className = "nav-icon"></FaHome></div>
            <div className = "active" onClick = {()=>{switchPage('/people')}}><FaUsers className = "nav-icon"></FaUsers></div> 
            <div className = "inactive" onClick = {()=>{switchPage('/notification')}}><FaBell className = "nav-icon"></FaBell></div> 
            <div className = "inactive" onClick = {()=>{switchPage('/chat')}}><FaEnvelope className = "nav-icon"></FaEnvelope></div> 
            <div className = "inactive" onClick = {()=>{switchPage('/menu')}}><FaBars className = "nav-icon"></FaBars></div>
        </header>   
      <div className = "people-body">
          <div className = "people-header">
              <h3>Follow more</h3>
              <button className = "search-button"><FaSearch className = "search-icon"></FaSearch></button>
          </div>
          <div className = "people-list-div">
             {people.map((user,id)=>(
                 <User  data = {user} id = {id}/>
             ))}
          </div>
      </div>
</>
    )
}
export default People